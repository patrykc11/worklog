import { OffsetPageOptionsDto } from '@worklog/shared/dtos/offset-page-options.dto';
import { WorklogReadModel } from '../../domain/read-models/worklog.read-model';
import { Worklog } from '../../domain/aggregates/worklog.aggregate';

export type WorklogIdentifierType = 'id';

export interface FindWorklogOptions {
  readonly value: string;
  readonly type: WorklogIdentifierType;
}

export interface FindWorklogsResult {
  readonly worklogs: WorklogReadModel[];
  readonly totalCount: number;
}

export interface FindWorklogsOptions {
  readonly worklogsIds?: string[];
  readonly usersIds?: string[];
  readonly projectsIds?: string[];
  readonly sinceDate?: Date;
  readonly toDate?: Date;
  readonly pageOptions?: OffsetPageOptionsDto;
}

export interface FindNotFinishedWorklogsOptions {
  readonly userId: string;
}

export abstract class WorklogRepository {
  public abstract findOne(options: FindWorklogOptions): Promise<Worklog | null>;
  public abstract findNotFinished(
    options: FindNotFinishedWorklogsOptions,
  ): Promise<Worklog[]>;
  public abstract findMany(
    options: FindWorklogsOptions,
  ): Promise<FindWorklogsResult>;
  public abstract create(worklog: Worklog): Promise<void>;
  public abstract update(worklog: Worklog): Promise<void>;
}
