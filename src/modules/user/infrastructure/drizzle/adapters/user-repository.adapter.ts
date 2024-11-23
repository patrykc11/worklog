import { Inject, Injectable } from '@nestjs/common';
import {
  FindUserOptions,
  FindUsersOptions,
  FindUsersResult,
  UserRepository,
} from '@worklog/modules/user/application/ports/user.repository';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schemas from '@worklog/modules/common/drizzle/schemas';
import { User } from '@worklog/modules/user/domain/aggregates/user.aggregate';
import { UserMapper } from '../mappers/user.mapper';
import { and, count, desc, eq, inArray } from 'drizzle-orm';
import { UserReadModel } from '@worklog/modules/user/domain/read-models/user.read-model';

@Injectable()
export class UserDrizzleRepository implements UserRepository {
  constructor(
    @Inject('DRIZZLE_DB')
    private db: NodePgDatabase<typeof schemas>,
  ) {}

  public async create(user: User): Promise<void> {
    const userEntity = UserMapper.toInsert(user);
    await this.db.insert(schemas.users).values(userEntity);
  }

  public async update(user: User): Promise<void> {
    const userEntity = UserMapper.toUpdate(user);
    await this.db
      .update(schemas.users)
      .set(userEntity)
      .where(eq(schemas.users.id, userEntity.id));
  }

  public async findOne(options: FindUserOptions): Promise<User | null> {
    const { type, value } = options;

    const user = await this.db.query.users.findFirst({
      where: (column, op) => op.eq(column[type], value),
    });

    return user ? UserMapper.toDomain(user) : null;
  }

  public async findMany({
    pageOptions,
    usersIds,
  }: FindUsersOptions): Promise<FindUsersResult> {
    const offset = (pageOptions.page - 1) * pageOptions.limit;
    const whereConditions = [];

    if (usersIds && usersIds.length > 0) {
      whereConditions.push(inArray(schemas.users.id, usersIds));
    }

    const totalCountQuery = this.db
      .select({ count: count() })
      .from(schemas.users)
      .where(and(...whereConditions))
      .then(([res]) => res?.count || 0);

    const usersQuery = this.db.query.users.findMany({
      where: and(...whereConditions),
      offset,
      orderBy: desc(schemas.users.createdAt),
      limit: pageOptions.limit,
    });

    const [users, usersCount] = await Promise.all([
      usersQuery,
      totalCountQuery,
    ]);

    return {
      users: users.map((user) => new UserReadModel({ ...user })),
      totalCount: usersCount,
    };
  }
}
