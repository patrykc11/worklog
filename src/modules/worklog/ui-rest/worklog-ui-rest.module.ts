import { Module } from '@nestjs/common';
import { WorklogModule } from '../infrastructure/worklog.module';
import { ProjectController } from './project/project.controller';
import { WorklogController } from './worklog/worklog.controller';

@Module({
  imports: [WorklogModule],
  controllers: [WorklogController, ProjectController],
})
export class WorklogUiRestModule {}
