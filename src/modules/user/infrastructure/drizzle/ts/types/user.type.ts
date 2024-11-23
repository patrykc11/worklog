import { users } from '@worklog/modules/common/drizzle/schemas';
import { UserRole } from '@worklog/shared/definitions';

export type InsertUserData = {
  id: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UpdateUserData = {
  id: string;
  email: string;
  password: string;
  isEmailConfirmed: boolean;
  refreshToken: string;
  roles: UserRole[];
  createdAt: Date;
  updatedAt: Date;
};

export type SelectUserData = typeof users.$inferSelect;
