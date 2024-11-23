import { UserRole } from '@worklog/shared/definitions';
import { Register, UserState } from '../ts';
import { Email, Password, UserId } from '../value-objects';
import { DateUtil } from '@worklog/shared/utils';

export class User implements UserState {
  public readonly id: UserId;
  public readonly password: Password;
  public email: Email;
  public isEmailConfirmed: boolean;
  public refreshToken: string | null;
  public updatedAt: Date;
  public readonly createdAt: Date;
  public roles: UserRole[];

  constructor(state: UserState) {
    Object.assign(this, state);
  }

  public static async register({ email, password }: Register) {
    return new User({
      id: UserId.generate(),
      email: new Email(email),
      password: await Password.generateHashFrom(password),
      isEmailConfirmed: false,
      refreshToken: null,
      roles: [],
      createdAt: DateUtil.now,
      updatedAt: DateUtil.now,
    });
  }

  public update(
    partialProps: Partial<
      Omit<UserState, 'id' | 'password' | 'createdAt' | 'updatedAt'>
    >,
  ): void {
    if (partialProps.email) {
      this.email = new Email(partialProps.email.value);
    }

    if (partialProps.refreshToken) {
      this.refreshToken = partialProps.refreshToken;
    }

    if (partialProps.isEmailConfirmed !== undefined) {
      this.isEmailConfirmed = partialProps.isEmailConfirmed;
    }

    if (partialProps.roles) {
      this.roles = partialProps.roles;
    }

    this.updatedAt = DateUtil.now;
  }
}
