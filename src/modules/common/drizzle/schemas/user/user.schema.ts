import { varchar, boolean, index } from 'drizzle-orm/pg-core';
import { basePgTable } from '../../tables/base-pg-table';

export const users = basePgTable(
  'users',
  {
    email: varchar('email', { length: 255 }).notNull(),
    password: varchar('password', { length: 255 }).notNull(),
    isEmailConfirmed: boolean('is_email_confirmed').default(false),
  },
  {
    extraConfig: (table) => ({
      emailIdx: index('email_idx').on(table.email),
    }),
  },
);
