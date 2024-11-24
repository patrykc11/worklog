import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticationService } from '../services/authentication.service';
import { DescribeApi } from '@worklog/shared/utils';
import {
  LoginUserDto,
  LoginUserDtoResponse,
  RefreshTokensDtoResponse,
  RegisterUserDto,
  RegisterUserDtoResponse,
  VerifyUserDto,
} from '../dtos/auth-user.dto';
import { JWTTokens } from '../ts/interfaces/token.interfaces';
import { AuthenticationGuard } from '../utils/guards/authentication.guard';
import { CurrentUser } from '../utils/decorators/current-user.decorator';
import { AuthenticatedUser } from '../models/authenticated-user';
import { RolesGuard } from '../utils/guards/roles.guard';
import { Roles } from '../utils/decorators/roles.decorator';
import { UserRole } from '@worklog/shared/definitions';
import { RefreshTokenGuard } from '../utils/guards/refresh-token.guard';
import { RequestWithRefreshToken } from '../ts/interfaces/auth-common.interfaces';

@Controller({
  path: '/auth',
})
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('/register')
  @DescribeApi({
    operationOptions: {
      description: 'Register a new user',
    },
    response: {
      status: 201,
      schema: RegisterUserDtoResponse,
    },
  })
  public register(
    @Body() { email, password }: RegisterUserDto,
  ): Promise<JWTTokens> {
    return this.authService.register({
      email,
      password,
    });
  }

  @Post('/login')
  @DescribeApi({
    operationOptions: {
      description: 'Login user',
    },
    response: {
      schema: LoginUserDtoResponse,
      status: 200,
    },
  })
  public loginUser(
    @Body() { email, password }: LoginUserDto,
  ): Promise<JWTTokens> {
    return this.authService.login({ email, password });
  }

  @UseGuards(RefreshTokenGuard)
  @Post('/refresh-tokens')
  @DescribeApi({
    operationOptions: {
      description: 'Refresh user tokens',
    },
    response: {
      schema: RefreshTokensDtoResponse,
      status: 200,
    },
  })
  public refreshTokens(
    @Req() req: RequestWithRefreshToken,
  ): Promise<JWTTokens> {
    return this.authService.refreshTokenRequest({
      userId: req.user.userId,
      refreshToken: req.user.refreshToken,
    });
  }

  @Patch('/verify-email')
  @UseGuards(AuthenticationGuard)
  @DescribeApi({
    operationOptions: {
      description: 'Verify user code',
    },
  })
  public verify(
    @Body() { email }: VerifyUserDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    return this.authService.verifyEmail({
      id: user.id,
      email,
    });
  }

  @UseGuards(AuthenticationGuard, RolesGuard)
  @Roles(UserRole.USER)
  @Get('/test-user')
  public testUser(@CurrentUser() user: AuthenticatedUser) {
    return user;
  }

  @UseGuards(AuthenticationGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('/test-admin')
  public testAdmin(@CurrentUser() user: AuthenticatedUser) {
    return user;
  }
}
