import { ApiProperty } from '@nestjs/swagger';
import { Book as PrismaBook } from '@prisma/client';

export class Book implements PrismaBook {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  author: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
