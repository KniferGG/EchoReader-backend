import { User as IUser } from '@prisma/client';

export class User implements IUser {
  id: string;
  login: string;
  email: string;
  hashedPassword: string;
  createdAt: Date;
  updatedAt: Date;
}
