import { INestApplication } from '@nestjs/common';
import { LoginDto } from 'src/auth/dto/login.dto';
import { RegisterDto } from 'src/auth/dto/register.dto';
import * as request from 'supertest';
import { Response } from 'supertest';

export async function authRegister(
  app: INestApplication<any>,
  auth: RegisterDto,
): Promise<Response> {
  const resp = await request(app.getHttpServer())
    .post('/auth/register')
    .send(auth);

  return resp;
}

export async function testAuthRegister(
  app: INestApplication<any>,
  auth: RegisterDto,
): Promise<Response> {
  const resp = await authRegister(app, auth);
  expect(resp.statusCode).toBe(200);

  return resp;
}

export async function authLogin(
  app: INestApplication<any>,
  auth: LoginDto,
): Promise<Response> {
  const resp = await request(app.getHttpServer())
    .post(`/auth/login`)
    .send(auth);

  return resp;
}

export async function testAuthLogin(
  app: INestApplication<any>,
  auth: LoginDto,
): Promise<Response> {
  const resp = await authLogin(app, auth);
  expect(resp.statusCode).toBe(201);

  return resp;
}

export async function authRefresh(
  app: INestApplication<any>,
  refreshToken: string,
): Promise<Response> {
  const resp = await request(app.getHttpServer())
    .post(`/auth/refresh`)
    .set('Cookie', `refresh_token=${refreshToken}`);

  return resp;
}

export async function testAuthRefresh(
  app: INestApplication<any>,
  refreshToken: string,
): Promise<Response> {
  const resp = await authRefresh(app, refreshToken);
  expect(resp.statusCode).toBe(200);

  return resp;
}

export async function authLogout(
  app: INestApplication<any>,
): Promise<Response> {
  const resp = await request(app.getHttpServer()).post(`/auth/logout`);

  return resp;
}

export async function testAuthLogout(
  app: INestApplication<any>,
): Promise<Response> {
  const resp = await authLogout(app);
  expect(resp.statusCode).toBe(200);
  expect(resp.body).toBeGreaterThan(0);
  return resp;
}

export async function authGoogle(
  app: INestApplication<any>,
): Promise<Response> {
  const resp = await request(app.getHttpServer()).get(`/auth/google`);

  return resp;
}

export async function testAuthGoogle(
  app: INestApplication<any>,
): Promise<Response> {
  const resp = await authGoogle(app);
  expect(resp.statusCode).toBe(302);
  return resp;
}

export async function authGoogleCallback(
  app: INestApplication<any>,
): Promise<Response> {
  const resp = await request(app.getHttpServer()).get(`/auth/google/callback`);

  return resp;
}

export async function testAuthGoogleCallback(
  app: INestApplication<any>,
): Promise<Response> {
  const resp = await authGoogleCallback(app);
  expect(resp.statusCode).toBe(302);
  return resp;
}
