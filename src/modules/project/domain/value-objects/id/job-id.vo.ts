import { UUID } from '@worklog/shared/architecture';

export class WorklogId extends UUID {
  public static override generate(): UUID {
    return new WorklogId(super.generate().value);
  }
}
