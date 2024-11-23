import { UserRole } from '@worklog/shared/definitions';
import { UserResource } from '../resources/user-resource';

type UserReadModelProps = {
  id: string;
  email: string;
  isEmailConfirmed: boolean;
  roles: UserRole[];
  createdAt: Date;
};

export class UserReadModel implements UserReadModelProps {
  public readonly id: string;
  public readonly email: string;
  public readonly isEmailConfirmed: boolean;
  public readonly roles: UserRole[];
  public readonly createdAt: Date;

  constructor(props: UserReadModelProps) {
    Object.assign(this, props);
  }

  public toResource(): UserResource {
    return {
      id: this.id,
      createdAt: this.createdAt,
      email: this.email,
      isEmailConfirmed: this.isEmailConfirmed,
      roles: this.roles,
    };
  }
}
