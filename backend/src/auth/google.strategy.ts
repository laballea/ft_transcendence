import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';

import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {

  constructor(
    private authService: AuthService,
  ) {
    super({
      clientID: process.env.googleID,
      clientSecret: process.env.googleSecret,
      callbackURL: `${process.env.REACT_APP_BACK_IP}/auth/google`,
      scope: ['email', 'profile'],
    });
  }

  async validate (accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { displayName, photos, id } = profile
    const user = {
      id: id,
      displayName:displayName,
      picture: photos[0].value,
      accessToken
    }
    return this.authService.loginGoogle(user, accessToken);
  }
}