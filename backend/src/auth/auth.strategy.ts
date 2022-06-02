import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserEntity } from '../user/models/user.entity';
import { AuthHelper } from './auth.helper';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	@Inject(AuthHelper)
	private readonly helper: AuthHelper;

	constructor(@Inject(ConfigService) config: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.SECRET_KEY,
			ignoreExpiration: true,
		});
	}

	private validate(payload: string): Promise<UserEntity | never> {
		return this.helper.validateUser(payload);
	}
}