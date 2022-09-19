import { Strategy } from 'passport-oauth2';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy, 'intra-oauth') {
	constructor(
		private authService: AuthService,
		private httpService: HttpService,
	) {
	super({
		authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
		tokenURL: 'https://api.intra.42.fr/oauth/token',
		clientID: process.env.clientID,
		clientSecret: process.env.clientSecret,
		callbackURL:
			`${process.env.REACT_APP_BACK_IP}/auth/intra`,
		});
	}

	async validate(accessToken: string): Promise<any> {
		let { data } = await lastValueFrom(this.httpService
		.get('https://api.intra.42.fr/v2/me', {
			headers: { Authorization: `Bearer ${accessToken}` },
		}));
		return this.authService.loginIntra(data, accessToken);
	}
}