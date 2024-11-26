import { Module } from '@nestjs/common';
import { WorklogApplicationModule } from '../application/worklog-application.module';
import { WorklogInfrastructureModule } from './worklog-infrastructure.module';

@Module({
  imports: [
    WorklogApplicationModule.withInfrastructure(WorklogInfrastructureModule),
  ],
  exports: [WorklogApplicationModule],
})
export class WorklogModule {}
