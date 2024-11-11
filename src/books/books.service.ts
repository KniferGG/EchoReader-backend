import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createBookDto: CreateBookDto) {
    const task = await this.prismaService.book.create({
      data: createBookDto,
    });
    return task;
  }

  findAll() {
    return this.prismaService.book.findMany();
  }

  findOne(id: string) {
    return this.getOneOrThrow(id);
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    await this.getOneOrThrow(id);
    return await this.prismaService.book.update({
      where: { id: id },
      data: updateBookDto,
    });
  }

  async delete(id: string) {
    await this.getOneOrThrow(id);
    const result = this.prismaService.book.delete({
      where: { id: id },
    });

    return result;
  }

  private async getOneOrThrow(id: string) {
    const book = await this.prismaService.book.findUnique({
      where: { id: id },
    });
    if (!book) throw new NotFoundException();
    return book;
  }
}
