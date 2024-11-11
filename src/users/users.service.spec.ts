import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from 'prisma/prisma/prisma.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

describe('UsersService', () => {
  let service: UsersService;
  let prismaServiceMock: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    prismaServiceMock = mockDeep<PrismaService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prismaServiceMock },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
