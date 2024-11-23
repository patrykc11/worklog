import { Module } from '@nestjs/common';
import { UserApplicationModule } from '../application/user-application.module';
import { UserInfrastructureModule } from './user-infrastructure.module';

@Module({
  imports: [UserApplicationModule.withInfrastructure(UserInfrastructureModule)],
  exports: [UserApplicationModule],
})
export class UserModule {}
