import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'prisma/prisma/prisma.service';
import { User } from './entities/user.entity';
import { GetUserDto } from './dto/get-user.dto copy';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.findOne({
      email: createUserDto.email,
      login: createUserDto.login,
    });

    if (user) throw new ConflictException();

    const createdUsers = await this.prismaService.user.create({
      data: createUserDto,
    });
    return createdUsers;
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne({ email, login, id }: GetUserDto) {
    if (!email && !login && !id) throw new BadRequestException();

    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [{ email }, { login }, { id }],
      },
    });

    return user;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
