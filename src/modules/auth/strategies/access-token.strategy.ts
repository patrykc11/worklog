import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

import { ACCESS_TOKEN_STRATEGY_NAME } from '../constants';
import { AuthenticatedUser } from '../models/authenticated-user';
import { AuthenticationService } from '../services/authentication.service';
import { getJwtFromHeaders } from '../utils/helpers/jwt';
import { AccessTokenPayload } from '../ts/interfaces/token.interfaces';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  ACCESS_TOKEN_STRATEGY_NAME,
) {
  constructor(authService: AuthenticationService) {
    const { authTokenSecret, algorithms, issuer } = authService.getConfig();

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: authTokenSecret,
      issuer,
      algorithms,
      passReqToCallback: true,
    });
  }

  public validate(
    req: Request,
    payload: AccessTokenPayload,
  ): AuthenticatedUser {
    const accessToken = getJwtFromHeaders(req.headers || {});

    if (!accessToken) {
      throw new UnauthorizedException('Missing access token');
    }

    return new AuthenticatedUser({
      sub: payload.sub,
      userRoles: payload.userRoles,
      accessToken,
    });
  }
}
