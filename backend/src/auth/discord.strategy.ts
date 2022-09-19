import { Strategy } from 'passport-oauth2';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord-oauth') {
	constructor(
		private authService: AuthService,
		private httpService: HttpService,
	) {
	super({
		authorizationURL: 'https://discord.com/api/oauth2/authorize?client_id=1021000693580038204&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fauth%2Flogin&response_type=code&scope=identify',
		tokenURL: 'https://discordapp.com/api/oauth2/token',
		clientID: process.env.discordID,
		clientSecret: process.env.discordSecret,
		callbackURL:
			`${process.env.REACT_APP_BACK_IP}/auth/discord`,
		});
	}

	async validate(accessToken: string): Promise<any> {
		let { data } = await lastValueFrom(this.httpService
		.get('https://discordapp.com/api/users/@me', {
			headers: { Authorization: `Bearer ${accessToken}` },
		}))
		return this.authService.loginDiscord(data, accessToken);
	}
}