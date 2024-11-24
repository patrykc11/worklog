import { type AuthenticatedUser } from '../../models/authenticated-user';
import { type RefreshTokenValidationResult } from './token.interfaces';

export interface AuthConfig {
  issuer: string;
  algorithms: string[];
  authTokenSecret: string;
  refreshTokenSecret: string;
}

export interface AuthenticatedRequest extends Request {
  readonly user: AuthenticatedUser;
}

export interface RequestWithUser extends Request {
  user?: AuthenticatedUser;
}

export interface RequestWithRefreshToken extends Request {
  readonly user: RefreshTokenValidationResult;
}
