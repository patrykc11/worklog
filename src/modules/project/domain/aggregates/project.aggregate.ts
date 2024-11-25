import { DateUtil } from '@worklog/shared/utils';
import { ProjectState } from '../ts/types/project.type';
import { ProjectId } from '../value-objects/id/project-id.vo';

export class Project implements ProjectState {
  public readonly id: ProjectId;
  public readonly name: string;
  public updatedAt: Date;
  public readonly createdAt: Date;

  constructor(state: ProjectState) {
    Object.assign(this, state);
  }

  public static async createProject(name: string): Promise<Project> {
    return new Project({
      id: ProjectId.generate(),
      name,
      createdAt: DateUtil.now,
      updatedAt: DateUtil.now,
    });
  }
}
