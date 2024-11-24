import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '@worklog/modules/user/application/services/user.service';
import { AuthConfig } from '../ts/interfaces/auth-common.interfaces';
import { ConfigService } from '@nestjs/config';
import { User } from '@worklog/modules/user/domain/aggregates/user.aggregate';
import {
  AccessTokenPayload,
  JWTTokens,
  RefreshTokenPayload,
  RefreshTokenValidationResult,
} from '../ts/interfaces/token.interfaces';
import {
  ConfirmEmailResource,
  UserLoginResource,
  UserRegisterResource,
} from '@worklog/modules/user/domain/resources/user-resource';

@Injectable()
export class AuthenticationService {
  private readonly logger = new Logger(AuthenticationService.name);

  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  public getConfig(): AuthConfig {
    return {
      algorithms: ['HS256'],
      issuer: this.configService.get<string>('TOKEN_ISSUER'),
      authTokenSecret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      refreshTokenSecret: this.configService.get<string>(
        'REFRESH_TOKEN_SECRET',
      ),
    };
  }

  async refreshTokenRequest({
    userId,
    refreshToken,
  }: RefreshTokenValidationResult): Promise<JWTTokens> {
    const user = await this.userService.getUserById(userId);

    if (user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Invalid token');
    }

    return this.generateTokens(user);
  }

  async register({
    email,
    password,
  }: UserRegisterResource): Promise<JWTTokens> {
    const user = await this.userService.registerNewUser({ email, password });

    return this.generateTokens(user);
  }

  async login({ email, password }: UserLoginResource): Promise<JWTTokens> {
    const user = await this.userService.loginUser({ email, password });

    return this.generateTokens(user);
  }

  async verifyEmail({ email, id }: ConfirmEmailResource): Promise<void> {
    await this.userService.confirmEmail({ id, email });

    return;
  }

  private async generateAccessToken(user: User): Promise<string> {
    const payload: AccessTokenPayload = {
      sub: user.id.value,
      userRoles: user.roles,
      type: 'access',
    };
    return this.jwtService.signAsync(payload, {
      secret: this.getConfig().authTokenSecret,
      issuer: this.getConfig().issuer,
      expiresIn: '15m',
    });
  }

  private async generateRefreshToken(user: User): Promise<string> {
    const payload: RefreshTokenPayload = {
      sub: user.id.value,
      type: 'refresh',
    };
    return this.jwtService.signAsync(payload, {
      secret: this.getConfig().refreshTokenSecret,
      issuer: this.getConfig().issuer,
      expiresIn: '10d',
    });
  }

  private async generateTokens(user: User): Promise<JWTTokens> {
    const tokens = {
      accessToken: await this.generateAccessToken(user),
      refreshToken: await this.generateRefreshToken(user),
    };

    await this.userService.assignRefreshToken(user, tokens.refreshToken);

    return tokens;
  }
}
