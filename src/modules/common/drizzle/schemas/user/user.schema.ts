import { varchar, boolean, index, text } from 'drizzle-orm/pg-core';
import { basePgTable } from '../../tables/base-pg-table';
import { UserRole } from '@worklog/shared/definitions';
import { relations, sql } from 'drizzle-orm';
import { worklogs } from '../worklog/worklog.schema';

export const users = basePgTable(
  'users',
  {
    email: varchar('email', { length: 255 }).notNull(),
    password: varchar('password', { length: 255 }).notNull(),
    isEmailConfirmed: boolean('is_email_confirmed').default(false),
    roles: text('roles')
      .array()
      .$type<UserRole[]>()
      .notNull()
      .default(sql`ARRAY[]::text[]`),
  },
  {
    extraConfig: (table) => ({
      emailIdx: index('email_idx').on(table.email),
    }),
  },
);

export const userRelations = relations(users, ({ many }) => ({
  worklogs: many(worklogs),
}));
