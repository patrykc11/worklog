import { text } from 'drizzle-orm/pg-core';
import { basePgTable } from '../../tables/base-pg-table';
import { relations } from 'drizzle-orm';
import { worklogs } from '../worklog/worklog.schema';

export const projects = basePgTable('projects', {
  name: text('name').notNull(),
});

export const projectRelations = relations(projects, ({ many }) => ({
  worklogs: many(worklogs),
}));
