import { Injectable } from '@nestjs/common';
import { User } from '@worklog/modules/user/domain/aggregates/user.aggregate';
import {
  Email,
  Password,
  UserId,
} from '@worklog/modules/user/domain/value-objects';
import {
  InsertUserData,
  SelectUserData,
  UpdateUserData,
} from '../ts/types/user.type';

@Injectable()
export class UserMapper {
  public static toDomain(entity: SelectUserData): User {
    return new User({
      id: new UserId(entity.id),
      email: new Email(entity.email),
      password: new Password(entity.password),
      isEmailConfirmed: entity.isEmailConfirmed,
      refreshToken: entity.refreshToken,
      roles: entity.roles,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  public static toInsert(entity: User): InsertUserData {
    return {
      id: entity.id.value,
      email: entity.email.value,
      password: entity.password.value,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  public static toUpdate(entity: User): Partial<UpdateUserData> {
    return {
      id: entity.id.value,
      email: entity.email.value,
      password: entity.password.value,
      isEmailConfirmed: entity.isEmailConfirmed,
      refreshToken: entity.refreshToken,
      roles: entity.roles,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
