import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { PrismaService } from 'prisma/prisma/prisma.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { Book } from '@prisma/client';

const testBook: Book = {
  id: '1',
  title: 'Book 1',
  author: 'Author 1',
  createdAt: undefined,
  updatedAt: undefined,
};

const testBook2: Book = {
  id: '2',
  title: 'Book 2',
  author: 'Author 2',
  createdAt: undefined,
  updatedAt: undefined,
};

describe('BooksController', () => {
  let controller: BooksController;
  let booksServiceMock: DeepMockProxy<BooksService>;
  let prismaServiceMock: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    prismaServiceMock = mockDeep<PrismaService>();
    booksServiceMock = mockDeep<BooksService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        { provide: BooksService, useValue: booksServiceMock },
        { provide: PrismaService, useValue: prismaServiceMock },
      ],
    }).compile();

    controller = module.get<BooksController>(BooksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call create method and return a new book', async () => {
    booksServiceMock.create.mockResolvedValue(testBook);

    const result = await controller.create(testBook);

    expect(result).toEqual(testBook);
    expect(booksServiceMock.create).toHaveBeenCalledWith(testBook);
  });

  it('should call findAll method and return books', async () => {
    booksServiceMock.findAll.mockResolvedValue([testBook, testBook2]);

    const result = await controller.findAll();

    expect(result).toEqual([testBook, testBook2]);
    expect(booksServiceMock.findAll).toHaveBeenCalled();
  });

  it('should call findOne method and return a book', async () => {
    booksServiceMock.findOne.mockResolvedValue(testBook);

    const result = await controller.findOne('1');

    expect(result).toEqual(testBook);
    expect(booksServiceMock.findOne).toHaveBeenCalledWith('1');
  });

  it('should call update method and return the updated book', async () => {
    booksServiceMock.update.mockResolvedValue(testBook);

    const result = await controller.update('1', testBook);

    expect(result).toEqual(testBook);
    expect(booksServiceMock.update).toHaveBeenCalledWith('1', testBook);
  });

  it('should call delete method and return the deleted book id', async () => {
    booksServiceMock.delete.mockResolvedValue(testBook);

    const result = await controller.remove('1');

    expect(result).toEqual(testBook);
    expect(booksServiceMock.delete).toHaveBeenCalledWith('1');
  });
});
