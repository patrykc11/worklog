import { OffsetPageOptionsDto } from '@worklog/shared/dtos/offset-page-options.dto';
import { Project } from '../../domain/aggregates/project.aggregate';
import { ProjectReadModel } from '../../domain/read-models/project.read-model';

export type ProjectIdentifierType = 'name' | 'id';

export interface FindProjectOptions {
  readonly value: string;
  readonly type: ProjectIdentifierType;
}

export interface FindProjectsResult {
  readonly projects: ProjectReadModel[];
  readonly totalCount: number;
}

export interface FindProjectsOptions {
  readonly projectsIds?: string[];
  readonly pageOptions: OffsetPageOptionsDto;
}

export abstract class ProjectRepository {
  public abstract findOne(options: FindProjectOptions): Promise<Project | null>;
  public abstract findMany(
    options: FindProjectsOptions,
  ): Promise<FindProjectsResult>;
  public abstract create(project: Project): Promise<void>;
  public abstract update(project: Project): Promise<void>;
}
