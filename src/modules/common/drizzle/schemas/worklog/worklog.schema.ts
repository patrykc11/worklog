import { index, text, timestamp } from 'drizzle-orm/pg-core';
import { basePgTable } from '../../tables/base-pg-table';
import { relations } from 'drizzle-orm';
import { DateUtil } from '@worklog/shared/utils';
import { users } from '../user/user.schema';
import { projects } from '../project/project.schema';

export const worklogs = basePgTable(
  'worklogs',
  {
    description: text('description').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
    projectId: text('project_id')
      .references(() => projects.id)
      .notNull(),
    startDate: timestamp('start_date', {
      withTimezone: true,
      mode: 'date',
    })
      .notNull()
      .$default(() => DateUtil.now),
    finishDate: timestamp('finish_date', {
      withTimezone: true,
      mode: 'date',
    }),
  },
  {
    extraConfig: (table) => ({
      userIdx: index('user_id_idx').on(table.userId),
      projectIdx: index('project_id_idx').on(table.projectId),
    }),
  },
);

export const worklogRelations = relations(worklogs, ({ one }) => ({
  projects: one(projects, {
    fields: [worklogs.projectId],
    references: [projects.id],
  }),
  users: one(users, {
    fields: [worklogs.userId],
    references: [users.id],
  }),
}));
