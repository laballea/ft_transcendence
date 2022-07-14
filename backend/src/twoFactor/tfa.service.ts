import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { User } from '../user/models/user.entity';
import { UserService } from '../user/user.service';
import { toFileStream } from 'qrcode';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TwoFactorAuthenticationService {
	constructor (
		private readonly userService: UserService,
		private readonly configService: ConfigService
	) {}

	public async generateTwoFactorAuthenticationSecret(user: User) {
		const secret = authenticator.generateSecret();

		const otpauthUrl = authenticator.keyuri(user.email, this.configService.get('TWO_FACTOR_AUTHENTICATION_APP_NAME'), secret);

		await this.userService.setTwoFactorAuthenticationSecret(secret, user.id);

		return {
			secret,
			otpauthUrl
		}
	}

	public isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, user: User) {
		return authenticator.verify({
			token: twoFactorAuthenticationCode,
			secret: user.twoFactorAuthenticationSecret
		})
	}

	public async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
		return toFileStream(stream, otpauthUrl);
	}
}