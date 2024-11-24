import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

import {
  REFRESH_TOKEN_BODY_FIELD,
  REFRESH_TOKEN_STRATEGY_NAME,
} from '../constants';
import { AuthenticationService } from '../services/authentication.service';
import {
  RefreshTokenPayload,
  RefreshTokenValidationResult,
} from '../ts/interfaces/token.interfaces';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  REFRESH_TOKEN_STRATEGY_NAME,
) {
  constructor(authService: AuthenticationService) {
    const { refreshTokenSecret, algorithms, issuer } = authService.getConfig();

    super({
      jwtFromRequest: ExtractJwt.fromBodyField(REFRESH_TOKEN_BODY_FIELD),
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
    const data = req.body;

    return {
      userId: payload.sub,
      refreshToken: data['refreshToken'],
    };
  }
}
