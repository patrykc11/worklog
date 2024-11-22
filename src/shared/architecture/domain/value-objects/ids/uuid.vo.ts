import { generateUUID } from '@worklog/shared/utils';
import { ValueObject } from '../value-object';
import { isUUID } from '@worklog/shared/utils';

export class UUID extends ValueObject<string> {
  constructor(value: string) {
    if (!UUID.isUUID(value)) {
      ValueObject.raiseException('UUID is not valid');
    }

    super(value);
  }

  public static generate(): UUID {
    return new UUID(generateUUID());
  }

  public static isUUID(value: string): boolean {
    return isUUID(value);
  }
}
