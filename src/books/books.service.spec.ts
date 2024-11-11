import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { PrismaService } from 'prisma/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
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

describe('BooksService', () => {
  let service: BooksService;
  let prismaServiceMock: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    prismaServiceMock = mockDeep<PrismaService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        { provide: PrismaService, useValue: prismaServiceMock },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a book', async () => {
      prismaServiceMock.book.create.mockResolvedValue(testBook);

      const result = await service.create(testBook);
      expect(result).toEqual(testBook);
      expect(prismaServiceMock.book.create).toHaveBeenCalledWith({
        data: testBook,
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of books', async () => {
      const books = [testBook, testBook2];

      prismaServiceMock.book.findMany.mockResolvedValue(books);

      const result = await service.findAll();
      expect(result).toEqual(books);
      expect(prismaServiceMock.book.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single book', async () => {
      prismaServiceMock.book.findUnique.mockResolvedValue(testBook);

      const result = await service.findOne(testBook.id);
      expect(result).toEqual(testBook);
      expect(prismaServiceMock.book.findUnique).toHaveBeenCalledWith({
        where: { id: testBook.id },
      });
    });

    it('should throw NotFoundException if book is not found', async () => {
      prismaServiceMock.book.findUnique.mockResolvedValue(null);

      await expect(service.findOne('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a book', async () => {
      prismaServiceMock.book.update.mockResolvedValue(testBook);
      prismaServiceMock.book.findUnique.mockResolvedValue(testBook);

      const result = await service.update(testBook.id, testBook2);
      expect(result).toEqual(testBook);
      expect(prismaServiceMock.book.update).toHaveBeenCalledWith({
        where: { id: testBook.id },
        data: testBook2,
      });
    });

    it('should throw NotFoundException if book is not found for update', async () => {
      prismaServiceMock.book.findUnique.mockResolvedValue(null);

      await expect(service.update('nonexistent-id', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete a book', async () => {
      prismaServiceMock.book.delete.mockResolvedValue(testBook);
      prismaServiceMock.book.findUnique.mockResolvedValue(testBook);

      const result = await service.delete(testBook.id);
      expect(result).toEqual(testBook);
      expect(prismaServiceMock.book.delete).toHaveBeenCalledWith({
        where: { id: testBook.id },
      });
    });

    it('should throw NotFoundException if book is not found for deletion', async () => {
      prismaServiceMock.book.findUnique.mockResolvedValue(null);

      await expect(service.delete('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
