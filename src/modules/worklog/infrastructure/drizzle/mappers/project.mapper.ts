import { Injectable } from '@nestjs/common';
import { UpsertProjectData, SelectProjectData } from '../ts/types/project.type';
import { ProjectId } from '@worklog/modules/worklog/domain/value-objects/id/project-id.vo';
import { Project } from '@worklog/modules/worklog/domain/aggregates/project.aggregate';

@Injectable()
export class ProjectMapper {
  public static toDomain(entity: SelectProjectData): Project {
    return new Project({
      id: new ProjectId(entity.id),
      name: entity.name,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  public static toUpsert(entity: Project): UpsertProjectData {
    return {
      id: entity.id.value,
      name: entity.name,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
