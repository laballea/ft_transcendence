import { Strategy } from 'passport-oauth2';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { UserService } from 'src/user/user.service';

@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy, 'intra-oauth') {
	constructor(
		private authService: AuthService,
		private httpService: HttpService,
	) {
	super({
		authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
		tokenURL: 'https://api.intra.42.fr/oauth/token',
		clientID: "254ee9c51d283d7911364b29f60d76fd8b47354cf9de36ed2edc9ae2d65e1136",
		clientSecret: "f8ee48aaeb21b0c523e2d072bde87f0dabb838ae9b843569e8964aefe7f3d7e6",
		callbackURL:
			"http://localhost:5000/auth/login",
		});
	}

	async validate(accessToken: string): Promise<any> {
		let { data } = await lastValueFrom(this.httpService
		.get('https://api.intra.42.fr/v2/me', {
			headers: { Authorization: `Bearer ${accessToken}` },
		}));
		return this.authService.loginIntra(data);
	}
}