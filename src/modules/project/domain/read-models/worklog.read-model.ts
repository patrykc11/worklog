import { WorklogResource } from '../resources/worklog-resource';

type WorklogReadModelProps = {
  id: string;
  description: string;
  userId: string;
  projectId: string;
  startDate: Date;
  finishDate: Date | null;
  createdAt: Date;
};

export class WorklogReadModel implements WorklogReadModelProps {
  public readonly id: string;
  public readonly description: string;
  public readonly userId: string;
  public readonly projectId: string;
  public readonly startDate: Date;
  public readonly finishDate: Date | null;
  public readonly createdAt: Date;

  constructor(props: WorklogReadModelProps) {
    Object.assign(this, props);
  }

  public toResource(): WorklogResource {
    return {
      id: this.id,
      createdAt: this.createdAt,
      description: this.description,
      userId: this.userId,
      projectId: this.projectId,
      startDate: this.startDate,
      finishDate: this.finishDate,
    };
  }
}
