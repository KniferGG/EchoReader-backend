import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (key: keyof User, ctx: ExecutionContext) => {
    const req: Request = ctx.switchToHttp().getRequest();

    const user = key ? req.user[key] : req.user;

    return user;
  },
);
