import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Observable } from 'rxjs';

import { getJwtFromHeaders } from '../helpers/jwt';
import { shouldSkipAuth } from '../helpers/skip-auth';
import {} from '@nestjs/core';
import { ACCESS_TOKEN_STRATEGY_NAME } from '../../constants';

@Injectable()
export class AuthenticationGuard extends AuthGuard(ACCESS_TOKEN_STRATEGY_NAME) {
  constructor() {
    super();
  }

  public override async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const accessToken = getJwtFromHeaders(request.headers || {}, 'Bearer');

    if (shouldSkipAuth(context)) {
      if (accessToken) {
        try {
          await this.checkUser(context);
        } catch (error) {
          console.log(error);
          throw new UnauthorizedException('Invalid token');
        }
      }

      return true;
    }

    if (!accessToken) {
      throw new UnauthorizedException('Missing token');
    }

    try {
      await this.checkUser(context);
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }

  private checkUser(
    context: ExecutionContext,
  ): Promise<boolean> | Observable<boolean> | boolean {
    try {
      return super.canActivate(context);
    } catch (error) {
      console.error('Validation Error:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
