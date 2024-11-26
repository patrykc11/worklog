import { ProjectResource } from '../resources/project-resource';

type ProjectReadModelProps = {
  id: string;
  name: string;
  createdAt: Date;
};

export class ProjectReadModel implements ProjectReadModelProps {
  public readonly id: string;
  public readonly name: string;
  public readonly createdAt: Date;

  constructor(props: ProjectReadModelProps) {
    Object.assign(this, props);
  }

  public toResource(): ProjectResource {
    return {
      id: this.id,
      createdAt: this.createdAt,
      name: this.name,
    };
  }
}
