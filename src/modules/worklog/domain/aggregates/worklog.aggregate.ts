import { UserId } from '@worklog/modules/user/domain/value-objects';
import { WorklogId } from '../value-objects/id/worklog-id.vo';
import { ProjectId } from '../value-objects/id/project-id.vo';
import { StartWork, WorklogState } from '../ts/types/worklog.type';
import { DateUtil } from '@worklog/shared/utils';

export class Worklog implements WorklogState {
  public readonly id: WorklogId;
  public description: string;
  public projectId: ProjectId;
  public userId: UserId;
  public startDate: Date;
  public finishDate?: Date | null;
  public updatedAt: Date;
  public readonly createdAt: Date;

  constructor(state: WorklogState) {
    Object.assign(this, state);
  }

  public static async startWork(data: StartWork) {
    return new Worklog({
      id: WorklogId.generate(),
      description: data.description,
      projectId: new ProjectId(data.projectId),
      userId: new UserId(data.userId),
      startDate: DateUtil.now,
      finishDate: null,
      createdAt: DateUtil.now,
      updatedAt: DateUtil.now,
    });
  }

  public async finishWork() {
    this.update({
      finishDate: DateUtil.now,
    });
  }

  public update(
    partialProps: Partial<
      Omit<
        WorklogState,
        'id' | 'projectId' | 'userId' | 'createdAt' | 'updatedAt'
      >
    >,
  ): void {
    if (partialProps.description) {
      this.description = partialProps.description;
    }

    if (partialProps.startDate) {
      this.startDate = partialProps.startDate;
    }

    if (partialProps.finishDate) {
      this.finishDate = partialProps.finishDate;
    }

    this.updatedAt = DateUtil.now;
  }
}
