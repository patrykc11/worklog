import { EMAIL_REGEX } from '@worklog/shared/definitions';
import { ValueObject } from '../value-object';

export class Email extends ValueObject<string> {
  constructor(value: string) {
    if (!EMAIL_REGEX.test(value)) {
      ValueObject.raiseException('Invalid email');
    }

    super(value);
  }
}
