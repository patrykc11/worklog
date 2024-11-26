import { UUID } from '@worklog/shared/architecture';

export class ProjectId extends UUID {
  public static override generate(): UUID {
    return new ProjectId(super.generate().value);
  }
}
