import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserInfrastructureModule } from '../infrastructure/user-infrastructure.module';
import { ApplicationLayerModule } from '@worklog/shared/architecture/application/application-layer.module';

@Module({
  providers: [UserService, UserInfrastructureModule],
  exports: [UserService],
})
export class UserApplicationModule extends ApplicationLayerModule {}
