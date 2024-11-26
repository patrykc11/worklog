import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schemas from '@worklog/modules/common/drizzle/schemas';
import { and, count, desc, eq, inArray } from 'drizzle-orm';
import {
  FindProjectOptions,
  FindProjectsOptions,
  FindProjectsResult,
  ProjectRepository,
} from '@worklog/modules/worklog/application/ports/project.repository';
import { Project } from '@worklog/modules/worklog/domain/aggregates/project.aggregate';
import { ProjectMapper } from '../mappers/project.mapper';
import { ProjectReadModel } from '@worklog/modules/worklog/domain/read-models/project.read-model';

@Injectable()
export class ProjectDrizzleRepository implements ProjectRepository {
  constructor(
    @Inject('DRIZZLE_DB')
    private db: NodePgDatabase<typeof schemas>,
  ) {}

  public async create(project: Project): Promise<void> {
    const projectEntity = ProjectMapper.toUpsert(project);
    await this.db.insert(schemas.projects).values(projectEntity);
  }

  public async update(project: Project): Promise<void> {
    const projectEntity = ProjectMapper.toUpsert(project);
    await this.db
      .update(schemas.projects)
      .set(projectEntity)
      .where(eq(schemas.projects.id, projectEntity.id));
  }

  public async findOne(options: FindProjectOptions): Promise<Project | null> {
    const { type, value } = options;

    const project = await this.db.query.projects.findFirst({
      where: (column, op) => op.eq(column[type], value),
    });

    return project ? ProjectMapper.toDomain(project) : null;
  }

  public async findMany({
    pageOptions,
    projectsIds,
  }: FindProjectsOptions): Promise<FindProjectsResult> {
    const offset = (pageOptions.page - 1) * pageOptions.limit;
    const whereConditions = [];

    if (projectsIds && projectsIds.length > 0) {
      whereConditions.push(inArray(schemas.projects.id, projectsIds));
    }

    const totalCountQuery = this.db
      .select({ count: count() })
      .from(schemas.projects)
      .where(and(...whereConditions))
      .then(([res]) => res?.count || 0);

    const projectsQuery = this.db.query.projects.findMany({
      where: and(...whereConditions),
      offset,
      orderBy: desc(schemas.projects.createdAt),
      limit: pageOptions.limit,
    });

    const [projects, projectsCount] = await Promise.all([
      projectsQuery,
      totalCountQuery,
    ]);

    return {
      projects: projects.map((project) => new ProjectReadModel({ ...project })),
      totalCount: projectsCount,
    };
  }
}
