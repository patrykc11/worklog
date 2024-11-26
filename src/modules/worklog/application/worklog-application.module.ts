import { Module } from '@nestjs/common';
import { WorklogService } from './services/worklog.service';
import { ApplicationLayerModule } from '@worklog/shared/architecture/application/application-layer.module';
import { WorklogInfrastructureModule } from '../infrastructure/worklog-infrastructure.module';
import { UserModule } from '@worklog/modules/user/infrastructure/user-module';

@Module({
  imports: [UserModule],
  providers: [WorklogService, WorklogInfrastructureModule],
  exports: [WorklogService],
})
export class WorklogApplicationModule extends ApplicationLayerModule {}
