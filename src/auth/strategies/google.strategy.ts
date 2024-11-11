import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { GoogleOauth } from '../entities/google-oauth-enum.entity';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.getOrThrow(GoogleOauth.GOOGLE_CLIENT_ID),
      clientSecret: configService.getOrThrow(GoogleOauth.GOOGLE_CLIENT_SECRET),
      callbackURL: configService.getOrThrow(GoogleOauth.GOOGLE_CALLBACK_URL),
      scope: ['email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: any,
  ) {
    done(null, profile);
  }
}
