import { UserRole } from '@worklog/shared/definitions';
import { Email, Password, UserId } from '../../value-objects';

export type UserState = {
  id: UserId;
  email: Email;
  password: Password;
  roles: UserRole[];
  refreshToken: string | null;
  isEmailConfirmed: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Register = {
  email: string;
  password: string;
};
