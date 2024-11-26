import { ProjectId } from '../../value-objects/id/project-id.vo';

export type ProjectState = {
  id: ProjectId;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};
