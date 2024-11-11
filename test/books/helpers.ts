import { INestApplication } from '@nestjs/common';
import { CreateBookDto } from 'src/books/dto/create-book.dto';
import * as request from 'supertest';
import { Response } from 'supertest';

let jwtAccessToken = '';

export function setBookToken(accessToken: string) {
  jwtAccessToken = accessToken;
}

export async function createBook(
  app: INestApplication<any>,
  book: CreateBookDto,
): Promise<Response> {
  const resp = await request(app.getHttpServer())
    .post('/books')
    .send(book)
    .set('Authorization', `Bearer ${jwtAccessToken}`);
  return resp;
}

export async function testCreateBook(
  app: INestApplication<any>,
  book: CreateBookDto,
): Promise<Response> {
  const resp = await createBook(app, book);
  expect(resp.statusCode).toBe(201);
  expect(resp.body).toMatchObject(book);
  return resp;
}

export async function getBooks(app: INestApplication<any>): Promise<Response> {
  const resp = await request(app.getHttpServer())
    .get(`/books`)
    .set('Authorization', `Bearer ${jwtAccessToken}`);
  return resp;
}

export async function testGetBooks(
  app: INestApplication<any>,
): Promise<Response> {
  const resp = await getBooks(app);
  expect(resp.statusCode).toBe(200);
  expect(resp.body.length).toBeGreaterThan(0);
  return resp;
}

export async function getBookOnId(
  app: INestApplication<any>,
  id: string,
): Promise<Response> {
  const resp = await request(app.getHttpServer())
    .get(`/books/${id}`)
    .set('Authorization', `Bearer ${jwtAccessToken}`);
  return resp;
}

export async function testGetBookOnId(
  app: INestApplication<any>,
  id: string,
  toMatch?: object,
): Promise<Response> {
  const resp = await getBookOnId(app, id);
  expect(resp.statusCode).toBe(200);
  expect(resp.body).toMatchObject(toMatch ?? {});
  return resp;
}

export async function patchBook(
  app: INestApplication<any>,
  id: string,
  updatedBook: object,
): Promise<Response> {
  const resp = await request(app.getHttpServer())
    .patch(`/books/${id}`)
    .send(updatedBook)
    .set('Authorization', `Bearer ${jwtAccessToken}`);

  return resp;
}

export async function testPatchBook(
  app: INestApplication<any>,
  id: string,
  updatedBook: object,
): Promise<Response> {
  const resp = await patchBook(app, id, updatedBook);
  expect(resp.statusCode).toBe(200);
  expect(resp.body).toMatchObject(updatedBook);
  return resp;
}

export async function deleteBook(
  app: INestApplication<any>,
  bookId: string,
): Promise<Response> {
  const resp = await request(app.getHttpServer())
    .delete(`/books/${bookId}`)
    .set('Authorization', `Bearer ${jwtAccessToken}`);
  return resp;
}

export async function testDeleteBook(
  app: INestApplication<any>,
  bookId: string,
  toMatch?: object,
): Promise<Response> {
  const resp = await deleteBook(app, bookId);
  expect(resp.statusCode).toBe(200);
  expect(resp.body).toMatchObject(toMatch ?? {});
  return resp;
}
