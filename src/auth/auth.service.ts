import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { RegisterDto } from './dto/register.dto';
import { Tokens } from './entities/token-name-enum.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto, res: Response) {
    const { password, ...createAuthData } = registerDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await this.usersService.create({
      ...createAuthData,
      hashedPassword: hashedPassword,
    });

    const accessToken = this.generateJwtTokens(createdUser.id, res);
    return accessToken;
  }

  async googleAuth(email: string, res: Response) {
    const user = await this.usersService.findOne({ email });
    if (user) return await this.generateJwtTokens(user.id, res);

    const createdUser = await this.usersService.create({ email });
    return await this.generateJwtTokens(createdUser.id, res);
  }

  async validateUser(password: string, email?: string) {
    const user = await this.usersService.findOne({ email });
    if (!user) return null;

    if (!user.hashedPassword) throw new BadRequestException();

    const isValidPassword = await bcrypt.compare(password, user.hashedPassword);
    if (!isValidPassword) return null;

    return user;
  }

  async generateJwtTokens(userId: string, res: Response) {
    const accessToken = await this.jwtService.signAsync(
      { id: userId },
      {
        secret: this.configService.getOrThrow(Tokens.ACCESS_TOKEN_ENV_NAME),
        expiresIn: this.configService.getOrThrow(
          Tokens.ACCESS_EXPIRES_IN_TOKEN_ENV_NAME,
        ),
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      { id: userId },
      {
        secret: this.configService.getOrThrow(Tokens.REFRESH_TOKEN_ENV_NAME),
        expiresIn: this.configService.getOrThrow(
          Tokens.REFRESH_EXPIRES_IN_TOKEN_ENV_NAME,
        ),
      },
    );

    res.cookie(Tokens.REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      secure: true,
    });

    return accessToken;
  }
}
