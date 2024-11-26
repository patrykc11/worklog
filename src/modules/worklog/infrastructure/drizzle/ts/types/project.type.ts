import { projects } from '@worklog/modules/common/drizzle/schemas';

export type UpsertProjectData = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type SelectProjectData = typeof projects.$inferSelect;
