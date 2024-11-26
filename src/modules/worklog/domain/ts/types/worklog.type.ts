import { WorklogId } from '../../value-objects/id/worklog-id.vo';
import { UserId } from '@worklog/modules/user/domain/value-objects';
import { ProjectId } from '../../value-objects/id/project-id.vo';

export type WorklogState = {
  id: WorklogId;
  description: string;
  projectId: ProjectId;
  userId: UserId;
  startDate: Date;
  finishDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type StartWork = {
  projectId: string;
  description: string;
  userId: string;
};

export type FinishWork = {
  id: WorklogId;
  userId: UserId;
};
