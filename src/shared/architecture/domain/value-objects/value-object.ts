import { BadRequestException } from '@nestjs/common';

export abstract class ValueObject<T> {
  constructor(public readonly value: T) {
    if (this.isEmpty(value)) {
      if (this.isEmpty(value)) {
        ValueObject.raiseException('ValueObject cannot be empty');
      }
    }
  }

  public toString(): string {
    return JSON.stringify(this);
  }

  public static isValueObject<T = unknown>(
    obj: unknown,
  ): obj is ValueObject<T> {
    return obj instanceof ValueObject;
  }

  protected static raiseException(message: string): never {
    throw new BadRequestException(message);
  }

  private isEmpty(value: T): boolean {
    return !value || value === '';
  }
}
