import { OmitKeys, UserRole } from '@worklog/shared/definitions';
import { AccessTokenPayload } from '../ts/interfaces/token.interfaces';
import { RoleMatchingMode } from '../ts/enums/auth.enums';

type AuthenticatedUserCtorArgs = OmitKeys<AccessTokenPayload, 'type'> & {
  accessToken: string;
};

export class AuthenticatedUser {
  public readonly id: string;
  public readonly roles: UserRole[];
  public readonly accessToken: string;

  constructor(data: AuthenticatedUserCtorArgs) {
    this.id = data.sub;
    this.roles = data.userRoles;
    this.accessToken = data.accessToken;
  }

  public isAdmin(): boolean {
    return this.hasRoles([UserRole.ADMIN]);
  }

  public hasRoles(
    roles: string[],
    mode: RoleMatchingMode = RoleMatchingMode.ANY,
  ): boolean {
    if (mode === RoleMatchingMode.ANY) {
      return roles.some((role) => this.roles.includes(role as UserRole));
    }
    return roles.every((role) => this.roles.includes(role as UserRole));
  }

  public static isAuthenticatedUser(data: unknown): data is AuthenticatedUser {
    return data instanceof AuthenticatedUser && !!data.id;
  }
}
