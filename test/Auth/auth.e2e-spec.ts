import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import {
  authLogin,
  authLogout,
  authRefresh,
  authRegister,
  testAuthGoogle,
  testAuthGoogleCallback,
  testAuthLogin,
  testAuthRegister,
} from './authHelpers';

describe('BooksController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  const registerBodyShortPassword = {
    login: 'test',
    email: 'test@mail.com',
    password: 'test',
  };

  const registerBodyWrong = {
    login: 'tester',
    email: 'tester@mail.com',
  };

  const registerBody = {
    login: 'tester',
    email: 'tester@mail.com',
    password: 'tester',
  };

  describe('/POST auth/register (e2e)', () => {
    it('/POST auth/register (wrong)', async () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const res = await authRegister(app, registerBodyWrong);
      expect(res.statusCode).toBe(400);
    });

    it('/POST auth/register (short password)', async () => {
      const res = await authRegister(app, registerBodyShortPassword);
      expect(res.statusCode).toBe(400);
    });

    it('/POST auth/register', async () => {
      await testAuthRegister(app, registerBody);
    });
  });

  describe('/POST auth/register (e2e)', () => {
    const LoginBodyWrongUser = {
      email: 'testeerwererwerererererererer@mail.com',
      password: 'tester',
    };

    const LoginBodyWrongPassword = {
      email: 'tester@mail.com',
      password: 'tester123',
    };

    const LoginBody = {
      email: 'tester@mail.com',
      password: 'tester',
    };

    it('/POST auth/login (wrong user)', async () => {
      const res = await authLogin(app, LoginBodyWrongUser);
      expect(res.statusCode).toBe(401);
    });

    it('/POST auth/login (wrong password)', async () => {
      const res = await authLogin(app, LoginBodyWrongPassword);
      expect(res.statusCode).toBe(401);
    });

    it('/POST auth/login', async () => {
      await testAuthLogin(app, LoginBody);
    });
  });

  describe('/POST auth/refresh (e2e)', () => {
    it('/POST auth/refresh (wrong)', async () => {
      const res = await authRefresh(app, '');
      expect(res.statusCode).toBe(500);
    });
  });

  describe('/POST auth/register (e2e)', () => {
    const LoginBodyWrongUser = {
      email: 'testeerwererwerererererererer@mail.com',
      password: 'tester',
    };

    const LoginBodyWrongPassword = {
      email: 'tester@mail.com',
      password: 'tester123',
    };

    const LoginBody = {
      email: 'tester@mail.com',
      password: 'tester',
    };

    it('/POST auth/login (wrong user)', async () => {
      const res = await authLogin(app, LoginBodyWrongUser);
      expect(res.statusCode).toBe(401);
    });

    it('/POST auth/login (wrong password)', async () => {
      const res = await authLogin(app, LoginBodyWrongPassword);
      expect(res.statusCode).toBe(401);
    });

    it('/POST auth/login', async () => {
      await testAuthLogin(app, LoginBody);
    });
  });

  describe('/POST auth/logout (e2e)', () => {
    it('/POST auth/logout (wrong)', async () => {
      const res = await authLogout(app);
      expect(res.statusCode).toBe(500);
    });
  });

  describe('/POST auth/google (e2e)', () => {
    it('/POST auth/google', async () => {
      await testAuthGoogle(app);
    });
  });

  describe('/POST auth/google/callback (e2e)', () => {
    it('/POST auth/google/callback', async () => {
      await testAuthGoogleCallback(app);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
