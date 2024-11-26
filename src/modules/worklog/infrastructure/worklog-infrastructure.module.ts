import { Module } from '@nestjs/common';
import { WorklogDrizzleModule } from './drizzle/worklog-drizzle.module';

@Module({
  imports: [WorklogDrizzleModule],
  exports: [WorklogDrizzleModule],
})
export class WorklogInfrastructureModule {}
