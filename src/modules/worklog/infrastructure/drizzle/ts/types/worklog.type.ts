import { worklogs } from '@worklog/modules/common/drizzle/schemas';

export type UpsertWorklogData = {
  id: string;
  description: string;
  userId: string;
  projectId: string;
  startDate: Date;
  finishDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type SelectWorklogData = typeof worklogs.$inferSelect;
