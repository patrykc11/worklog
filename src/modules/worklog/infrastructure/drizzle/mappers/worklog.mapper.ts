import { Injectable } from '@nestjs/common';
import { ProjectId } from '@worklog/modules/worklog/domain/value-objects/id/project-id.vo';
import { Worklog } from '@worklog/modules/worklog/domain/aggregates/worklog.aggregate';
import { SelectWorklogData, UpsertWorklogData } from '../ts/types/worklog.type';
import { WorklogId } from '@worklog/modules/worklog/domain/value-objects/id/worklog-id.vo';
import { UserId } from '@worklog/modules/user/domain/value-objects';

@Injectable()
export class WorklogMapper {
  public static toDomain(entity: SelectWorklogData): Worklog {
    return new Worklog({
      id: new WorklogId(entity.id),
      description: entity.description,
      projectId: new ProjectId(entity.projectId),
      userId: new UserId(entity.userId),
      startDate: entity.startDate,
      finishDate: entity.finishDate ?? null,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  public static toUpsert(entity: Worklog): UpsertWorklogData {
    return {
      id: entity.id.value,
      description: entity.description,
      projectId: entity.projectId.value,
      userId: entity.userId.value,
      startDate: entity.startDate,
      finishDate: entity.finishDate ?? null,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
