import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { CreateBookDto } from 'src/books/dto/create-book.dto';
import {
  createBook,
  deleteBook,
  getBookOnId,
  patchBook,
  setBookToken,
  testCreateBook,
  testDeleteBook,
  testGetBookOnId,
  testGetBooks,
  testPatchBook,
} from './helpers';
import { getAccessToken } from 'test/Auth/getAccessToken';

describe('BooksController (e2e)', () => {
  let app: INestApplication;

  let createdBookId: string;
  const book404Id = '404.4';
  const bedBook = {
    title: 1,
    author: 1,
  };
  const emptyBook: CreateBookDto = {
    title: '',
    author: '',
  };
  const newBook: CreateBookDto = {
    title: 'Test Book',
    author: 'Test Author',
  };
  const updatedBook: CreateBookDto = {
    title: 'Updated Book',
    author: 'Updated Author',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const token: string = await getAccessToken(app);
    setBookToken(token);
  });

  it('/POST books (проверка ошибочного создания книги)', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const respErrorBedBook = await createBook(app, bedBook);
    expect(respErrorBedBook.statusCode).toBe(400);
  });

  it('/POST books (проверка ошибочного создания пустой книги)', async () => {
    const respErrorEmptyBook = await createBook(app, emptyBook);
    expect(respErrorEmptyBook.statusCode).toBe(400);
  });

  it('/POST books (проверка создания неполной книги)', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { author, ...book } = newBook;
    const resp = await createBook(app, book);
    expect(resp.statusCode).toBe(201);
    expect(resp.body).toMatchObject(book);

    const delBookId = resp.body.id;
    await testDeleteBook(app, delBookId);
  });

  it('/POST books (проверка создания книги)', async () => {
    const resp = await testCreateBook(app, newBook);
    createdBookId = resp.body.id;
  });

  it('/GET books (проверка получения всех книг)', async () => {
    await testGetBooks(app);
  });

  it('/GET books/:id (проверка ошибочного получения книги по id)', async () => {
    const resp = await getBookOnId(app, book404Id);
    expect(resp.statusCode).toBe(404);
  });

  it('/GET books/:id (проверка получения книги по id)', async () => {
    await testGetBookOnId(app, createdBookId);
  });

  it('/PATCH books/:id (проверка ошибочного обновления книги)', async () => {
    const resp = await patchBook(app, createdBookId, bedBook);
    expect(resp.statusCode).toBe(400);
  });

  it('/PATCH books/:id (проверка обновления книги)', async () => {
    await testPatchBook(app, createdBookId, updatedBook);
  });

  it('/DELETE books/:id (проверка ошибочного удаления книги)', async () => {
    const resp = await deleteBook(app, book404Id);
    expect(resp.statusCode).toBe(404);
  });

  it('/DELETE books/:id (проверка удаления книги)', async () => {
    const resp = await testDeleteBook(app, createdBookId);

    expect(resp.statusCode).toBe(200);
    expect(resp.body).toMatchObject(updatedBook);
  });

  afterAll(async () => {
    await app.close();
  });
});
