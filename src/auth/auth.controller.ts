import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Get,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/utils/decorators/current-user.decorator';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Tokens } from './entities/token-name-enum.entity';
import { ApiResponse } from '@nestjs/swagger';
import { AuthToken } from './entities/auth-token.entity';

@UsePipes(new ValidationPipe())
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({ status: 200, type: AuthToken })
  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.register(registerDto, res);
    return { accessToken: token };
  }

  @ApiResponse({ status: 200, type: AuthToken })
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @CurrentUser('id') userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.generateJwtTokens(userId, res);
    return { accessToken: token };
  }

  // TODO: 500 on null cookies
  @ApiResponse({ status: 200, type: AuthToken })
  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  async refresh(
    @CurrentUser('id') userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.generateJwtTokens(userId, res);
    return { accessToken: token };
  }

  // TODO: 500 on null cookies
  @ApiResponse({ status: 200, type: AuthToken })
  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.cookie(Tokens.REFRESH_TOKEN, '', {
      httpOnly: true,
      secure: true,
    });

    return;
  }

  @UseGuards(AuthGuard('google'))
  @Get('google')
  google() {}

  @ApiResponse({ status: 200, type: AuthToken })
  @UseGuards(AuthGuard('google'))
  @Get('google/callback')
  async googleCallback(
    @Req() req: Request & { user: { _json: { email: string } } },
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.googleAuth(req.user._json.email, res);
    return {
      accessToken: token,
    };
  }
}
