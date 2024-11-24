import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { AuthGuard } from '@nestjs/passport';
import { REFRESH_TOKEN_STRATEGY_NAME } from '../../constants';

@Injectable()
export class RefreshTokenGuard extends AuthGuard(REFRESH_TOKEN_STRATEGY_NAME) {
  public override async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const data = request.body;

    if (data['type'] !== 'refresh') {
      return true;
    }

    try {
      await super.canActivate(new ExecutionContextHost([request]));
    } catch (error) {
      throw new UnauthorizedException({
        message: 'Invalid refresh token',
      });
    }

    return true;
  }
}
