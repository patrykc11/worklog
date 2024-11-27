import { type INestApplication } from '@nestjs/common';

import * as request from 'supertest';

import { TestHelper } from '../helper/test-helper';
import { JWTTokens } from '@worklog/modules/auth/ts/interfaces/token.interfaces';

describe('Auth', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const { application } = await TestHelper.prepareFixture();

    app = await application.init();
  });

  afterAll(async () => {
    await TestHelper.cleanDatabase();
  });

  let normalUserTokens: JWTTokens;
  let adminUserTokens: JWTTokens;

  describe('should pass auth flow', () => {
    let tokens: JWTTokens;
    it('should register user and return tokens', async () => {
      const { body, status } = await request(app.getHttpServer())
        .post(`/v1/auth/register`)
        .send({
          email: 'test@test.pl',
          password: 'ZAQ!2wsx',
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

    it('should verify user email', async () => {
      const { body, status } = await request(app.getHttpServer())
        .patch(`/v1/auth/verify-email`)
        .send({
          email: 'test@test.pl',
        })
        .set({
          accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokens.accessToken}`,
        });
      expect(status).toBe(200);

      tokens = {
        accessToken: body.accessToken,
        refreshToken: body.refreshToken,
      };
    });

    it('should  login user', async () => {
      const { body, status } = await request(app.getHttpServer())
        .post(`/v1/auth/login`)
        .send({
          email: 'test@test.pl',
          password: 'ZAQ!2wsx',
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

      normalUserTokens = tokens;
    });

    it('should  refresh user token', async () => {
      const { body, status } = await request(app.getHttpServer())
        .post(`/v1/auth/refresh-tokens`)
        .set({
          accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokens.refreshToken}`,
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

      normalUserTokens = tokens;
    });
  });
});
