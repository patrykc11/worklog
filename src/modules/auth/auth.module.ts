import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ACCESS_TOKEN_STRATEGY_NAME } from './constants';
import { UserModule } from '../user/infrastructure/user-module';
import { AuthenticationService } from './services/authentication.service';
import { UserService } from '../user/application/services/user.service';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [
    JwtModule.register({}),
    PassportModule.register({
      defaultStrategy: [ACCESS_TOKEN_STRATEGY_NAME],
    }),
    UserModule,
  ],
  providers: [AuthenticationService, UserService, AccessTokenStrategy],
  controllers: [AuthController],
  exports: [AuthenticationService],
})
export class AuthUiRestModule {}
