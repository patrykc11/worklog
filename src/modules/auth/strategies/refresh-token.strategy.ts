import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

import { REFRESH_TOKEN_STRATEGY_NAME } from '../constants';
import { AuthenticationService } from '../services/authentication.service';
import {
  RefreshTokenPayload,
  RefreshTokenValidationResult,
} from '../ts/interfaces/token.interfaces';
import { getJwtFromHeaders } from '../utils/helpers/jwt';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  REFRESH_TOKEN_STRATEGY_NAME,
) {
  constructor(authService: AuthenticationService) {
    const { refreshTokenSecret, algorithms, issuer } = authService.getConfig();

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: refreshTokenSecret,
      issuer,
      algorithms,
      passReqToCallback: true,
    });
  }

  public validate(
    req: Request,
    payload: RefreshTokenPayload,
  ): RefreshTokenValidationResult {
    const refreshToken = getJwtFromHeaders(req.headers || {});

    return {
      userId: payload.sub,
      refreshToken,
    };
  }
}
