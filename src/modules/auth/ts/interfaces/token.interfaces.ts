import { UserRole, OmitKeys } from '@worklog/shared/definitions';

export type TokenType = 'access' | 'refresh';

interface RequiredTokenPayload {
  readonly sub: string;
  readonly type: TokenType;
}

export interface AccessTokenPayload extends RequiredTokenPayload {
  readonly userRoles: UserRole[];
}

export interface RefreshTokenPayload extends RequiredTokenPayload {}

export interface RefreshTokenValidationResult
  extends OmitKeys<RefreshTokenPayload, 'sub' | 'type'> {
  readonly userId: string;
  readonly refreshToken: string;
}

export interface JWTTokens {
  readonly accessToken: string;
  readonly refreshToken: string;
}
