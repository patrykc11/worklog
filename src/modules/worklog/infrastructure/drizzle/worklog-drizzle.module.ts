import { Module } from '@nestjs/common';
import { WorklogMapper } from './mappers/worklog.mapper';
import { ProjectMapper } from './mappers/project.mapper';
import { WorklogRepository } from '../../application/ports/worklog.repository';
import { ProjectRepository } from '../../application/ports/project.repository';
import { WorklogDrizzleRepository } from './adapters/worklog-repository.adapter';
import { ProjectDrizzleRepository } from './adapters/project-repository.adapter';

@Module({
  providers: [
    WorklogMapper,
    ProjectMapper,
    {
      provide: WorklogRepository,
      useClass: WorklogDrizzleRepository,
    },
    {
      provide: ProjectRepository,
      useClass: ProjectDrizzleRepository,
    },
  ],
  exports: [ProjectRepository, WorklogRepository],
})
export class WorklogDrizzleModule {}
