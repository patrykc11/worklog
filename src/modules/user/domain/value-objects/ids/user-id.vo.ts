import { UUID } from '@worklog/shared/architecture';

export class UserId extends UUID {
  public static override generate(): UUID {
    return new UserId(super.generate().value);
  }
}
