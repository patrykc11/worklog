import { INestApplication } from '@nestjs/common';
import { TestHelper } from '../helper/test-helper';
import * as request from 'supertest';

import { JWTTokens } from '@worklog/modules/auth/ts/interfaces/token.interfaces';
import { UserRole } from '@worklog/shared/definitions';

describe('Worklogs', () => {
  let app: INestApplication;
  let adminUser;

  beforeAll(async () => {
    const { application, userRepository } = await TestHelper.prepareFixture();
    app = await application.init();

    adminUser = await TestHelper.createRandomUser(
      userRepository,
      [UserRole.USER, UserRole.ADMIN],
      'xyz@123.pl',
      'zaq1@WSX',
    );
  });

  afterAll(async () => {
    await TestHelper.cleanDatabase();
  });

  let projectId: string;
  let tokens: JWTTokens;

  describe('should pass project create flow', () => {
    it('should  login user', async () => {
      const { body, status } = await request(app.getHttpServer())
        .post(`/v1/auth/login`)
        .send({
          email: 'xyz@123.pl',
          password: 'zaq1@WSX',
        })
        .set({
          accept: 'application/json',
          'Content-Type': 'application/json',
        });
      expect(status).toBe(201);
      expect(body.accessToken).not.toBeUndefined();
      expect(body.accessToken).not.toBeNull();
      expect(typeof body.accessToken).toBe('string');
      expect(body.refreshToken).not.toBeUndefined();
      expect(body.refreshToken).not.toBeNull();
      expect(typeof body.refreshToken).toBe('string');

      tokens = {
        accessToken: body.accessToken,
        refreshToken: body.refreshToken,
      };
    });

    it('should  create new project', async () => {
      const { body, status } = await request(app.getHttpServer())
        .post(`/v1/projects/add`)
        .send({
          name: 'New project A',
        })
        .set({
          accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokens.accessToken}`,
        });

      expect(status).toBe(201);
      expect(body.id).not.toBeUndefined();
      expect(body.id).not.toBeNull();
      expect(typeof body.id).toBe('string');

      projectId = body.id;
    });
  });

  describe('should pass start/stop working flow', () => {
    let worklogId: string;
    it('should start work', async () => {
      const { body, status } = await request(app.getHttpServer())
        .post(`/v1/worklogs/start`)
        .send({
          description: 'First day of work',
          projectId,
        })
        .set({
          accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokens.accessToken}`,
        });

      expect(status).toBe(201);
      expect(body.id).not.toBeUndefined();
      expect(body.id).not.toBeNull();
      expect(typeof body.id).toBe('string');

      worklogId = body.id;
    });

    it('should finish work', async () => {
      const { status } = await request(app.getHttpServer())
        .patch(`/v1/worklogs/${worklogId}/finish`)
        .set({
          accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokens.accessToken}`,
        });

      expect(status).toBe(200);
    });
  });

  describe('should get working time', () => {
    it('should get my working time', async () => {
      const { body, status } = await request(app.getHttpServer())
        .get(`/v1/worklogs/working-time/me`)
        .set({
          accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokens.accessToken}`,
        });

      expect(status).toBe(200);
      expect(body).not.toBeUndefined();
      expect(body).not.toBeNull();
    });

    it('should get working time from all users', async () => {
      const { body, status } = await request(app.getHttpServer())
        .get(`/v1/worklogs/working-time/all`)
        .set({
          accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokens.accessToken}`,
        });

      expect(status).toBe(200);
      expect(body).not.toBeUndefined();
      expect(body).not.toBeNull();
    });
  });
});
