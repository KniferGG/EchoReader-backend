import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { JwtPayload } from 'src/utils/decorators/types/jwt-payload';
import { UsersService } from 'src/users/users.service';
import { Tokens } from '../entities/token-name-enum.entity';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: (req: Request) => req.cookies[Tokens.REFRESH_TOKEN],
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow(Tokens.REFRESH_TOKEN_ENV_NAME),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findOne({ id: payload.id });

    if (!user) throw new UnauthorizedException();

    return user;
  }
}
