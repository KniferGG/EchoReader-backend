import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

const body = {
  email: 'string@mail.com',
  password: 'string',
};

export async function getAccessToken(
  app: INestApplication<any>,
): Promise<string> {
  const resp = await request(app.getHttpServer())
    .post('/auth/login')
    .send(body);

  return resp.body.accessToken as string;
}
