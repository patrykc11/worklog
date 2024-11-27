import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schemas from '@worklog/modules/common/drizzle/schemas';
import { and, count, desc, eq, gte, inArray, lte } from 'drizzle-orm';
import {
  FindNotFinishedWorklogsOptions,
  FindWorklogOptions,
  FindWorklogsOptions,
  FindWorklogsResult,
  WorklogRepository,
} from '@worklog/modules/worklog/application/ports/worklog.repository';
import { WorklogMapper } from '../mappers/worklog.mapper';
import { Worklog } from '@worklog/modules/worklog/domain/aggregates/worklog.aggregate';
import { WorklogReadModel } from '@worklog/modules/worklog/domain/read-models/worklog.read-model';

@Injectable()
export class WorklogDrizzleRepository implements WorklogRepository {
  constructor(
    @Inject('DRIZZLE_DB')
    private db: NodePgDatabase<typeof schemas>,
  ) {}

  public async create(worklog: Worklog): Promise<void> {
    const worklogEntity = WorklogMapper.toUpsert(worklog);
    await this.db.insert(schemas.worklogs).values(worklogEntity);
  }

  public async update(worklog: Worklog): Promise<void> {
    const worklogEntity = WorklogMapper.toUpsert(worklog);
    await this.db
      .update(schemas.worklogs)
      .set(worklogEntity)
      .where(eq(schemas.worklogs.id, worklogEntity.id));
  }

  public async findOne(options: FindWorklogOptions): Promise<Worklog | null> {
    const { type, value } = options;

    const worklog = await this.db.query.worklogs.findFirst({
      where: (column, op) => op.eq(column[type], value),
    });

    return worklog ? WorklogMapper.toDomain(worklog) : null;
  }

  public async findNotFinished(
    options: FindNotFinishedWorklogsOptions,
  ): Promise<Worklog[]> {
    const worklogs = await this.db.query.worklogs.findMany({
      where: and(
        eq(schemas.worklogs.userId, options.userId),
        eq(schemas.worklogs.finishDate, null),
      ),
    });

    return worklogs.map((worklog) => WorklogMapper.toDomain(worklog));
  }

  public async findMany(
    data: FindWorklogsOptions,
  ): Promise<FindWorklogsResult> {
    const whereConditions = [];
    if (data.sinceDate && data.toDate) {
      whereConditions.push(
        and(
          gte(schemas.worklogs.finishDate, data.sinceDate),
          lte(schemas.worklogs.finishDate, data.toDate),
        ),
      );
    } else {
      if (data.sinceDate) {
        whereConditions.push(gte(schemas.worklogs.finishDate, data.sinceDate));
      }
      if (data.toDate) {
        whereConditions.push(lte(schemas.worklogs.finishDate, data.toDate));
      }
    }

    if (data.projectsIds && data.projectsIds.length > 0) {
      whereConditions.push(
        inArray(schemas.worklogs.projectId, data.projectsIds),
      );
    }

    if (data.usersIds && data.usersIds.length > 0) {
      whereConditions.push(inArray(schemas.worklogs.userId, data.usersIds));
    }

    if (data.worklogsIds && data.worklogsIds.length > 0) {
      whereConditions.push(inArray(schemas.worklogs.id, data.worklogsIds));
    }

    const totalCountQuery = this.db
      .select({ count: count() })
      .from(schemas.worklogs)
      .where(and(...whereConditions))
      .then(([res]) => res?.count || 0);

    const worklogsQuery = this.db.query.worklogs.findMany({
      where: and(...whereConditions),
      orderBy: desc(schemas.worklogs.createdAt),
    });

    const [worklogs, worklogsCount] = await Promise.all([
      worklogsQuery,
      totalCountQuery,
    ]);

    return {
      worklogs: worklogs.map((worklog) => new WorklogReadModel({ ...worklog })),
      totalCount: worklogsCount,
    };
  }
}
