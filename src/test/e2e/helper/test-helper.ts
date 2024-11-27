import { Test, type TestingModule } from '@nestjs/testing';

import { faker } from '@faker-js/faker';
import { sql } from 'drizzle-orm';
import * as postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { INestApplication, VersioningType } from '@nestjs/common';

import { AppModule } from '@worklog/app.module';
import { AuthenticationService } from '@worklog/modules/auth/services/authentication.service';
import {
  API_DEFAULT_VERSION,
  API_VERSION_PREFIX,
  UserRole,
} from '@worklog/shared/definitions';
import { UserRepository } from '@worklog/modules/user/application/ports/user.repository';
import { User } from '@worklog/modules/user/domain/aggregates/user.aggregate';

// import { User } from '@worklog/modules/user/domain/aggregates/user.aggregate';

export class TestHelper {
  public static async prepareFixture(): Promise<{
    application: INestApplication;
    authService: AuthenticationService;
    userRepository: UserRepository;
  }> {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const authService = moduleFixture.get<AuthenticationService>(
      AuthenticationService,
    );

    const userRepository = moduleFixture.get<UserRepository>(UserRepository);

    const application = moduleFixture.createNestApplication();

    application.enableShutdownHooks().enableVersioning({
      type: VersioningType.URI,
      defaultVersion: API_DEFAULT_VERSION,
      prefix: API_VERSION_PREFIX,
    });

    return {
      application,
      authService,
      userRepository,
    };
  }

  public static async createRandomAdminUser(
    userRepository: UserRepository,
    email?: string,
    password?: string,
  ): Promise<User> {
    const newUser = await User.register({
      email: email ? email : faker.internet.email(),
      password: password ? password : faker.internet.password(),
    });

    await userRepository.create(newUser);

    newUser.update({
      isEmailConfirmed: true,
      roles: [UserRole.ADMIN, UserRole.USER],
    });

    await userRepository.update(newUser);

    return newUser;
  }

  public static async cleanDatabase(): Promise<void> {
    const databaseUrl = process.env['DATABASE_URL'];
    if (!databaseUrl) {
      throw new Error('DATABASE_URL is not defined');
    }

    const client = postgres(databaseUrl);
    const db = drizzle(client);

    // Fetch all table names
    const tables: postgres.RowList<Record<string, unknown>[]> =
      await db.execute(sql`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
    `);

    // Map to get only the table names as strings
    const tableNames = tables.map(
      (row: Record<string, unknown>) => row['tablename'] as string,
    );

    if (tableNames.length > 0) {
      // Truncate all tables
      await db.execute(sql`
        TRUNCATE ${sql.join(
          tableNames.map((name) => sql.identifier(name)),
          sql`, `,
        )} CASCADE
      `);
    }
  }
}
