import { OffsetPageOptionsDto } from '@worklog/shared/dtos/offset-page-options.dto';
import { User } from '../../domain/aggregates/user.aggregate';
import { UserReadModel } from '../../domain/read-models/user.read-model';

export type UserIdentifierType = 'email' | 'id';

export interface FindUserOptions {
  readonly value: string;
  readonly type: UserIdentifierType;
}

export interface FindUsersResult {
  readonly users: UserReadModel[];
  readonly totalCount: number;
}

export interface FindUsersOptions {
  readonly usersIds?: string[];
  readonly pageOptions: OffsetPageOptionsDto;
}

export abstract class UserRepository {
  public abstract findOne(options: FindUserOptions): Promise<User | null>;
  public abstract findMany(options: FindUsersOptions): Promise<FindUsersResult>;
  public abstract create(user: User): Promise<void>;
  public abstract update(user: User): Promise<void>;
}
