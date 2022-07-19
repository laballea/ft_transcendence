import {
	ClassSerializerInterceptor,
	Controller,
	Post,
	UseInterceptors,
	UseGuards,
	Req,
	Res,
	Body,
	UnauthorizedException, HttpCode,
} from '@nestjs/common';
import { TwoFactorAuthenticationService } from './tfa.service';
import JwtAuthenticationGuard from '../auth/auth.guard';
import RequestWithUser from '../auth/requestWithUser.interface';
import { TwoFactorAuthenticationCodeDto } from '../auth/auth.dto'
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { Response } from 'express';

@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthenticationController {
	constructor(
		private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
		private readonly userService: UserService,
		private readonly authenticationService: AuthService,
	) {}

	@Post('generate')
	@UseGuards(JwtAuthenticationGuard)
	async register(@Res() response: Response, @Req() request: RequestWithUser) {
		const { otpauthUrl } = await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(request.user);
		return this.twoFactorAuthenticationService.pipeQrCodeStream(response, otpauthUrl);
	}

	@Post('turn-on')
	@HttpCode(200)
	@UseGuards(JwtAuthenticationGuard)
	async turnOnTwoFactorAuthentication(@Req() request: RequestWithUser, @Body() { code } : TwoFactorAuthenticationCodeDto) {
		const isCodeValid = this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(code, request.user);
		if (!isCodeValid) {
			throw new UnauthorizedException('Wrong authentication code');
		}
		await this.userService.turnOnTwoFactorAuthentication(request.user.id);
	}

	@Post('authenticate')
	@HttpCode(200)
	@UseGuards(JwtAuthenticationGuard)
	async authenticate(@Req() request: RequestWithUser, @Body() { code } : TwoFactorAuthenticationCodeDto) {
		console.log("yooh")
		const isCodeValid = this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(code, request.user);
		if (!isCodeValid) {
			throw new UnauthorizedException('Wrong authentication code');
		}
		const accessTokenCookie = this.authenticationService.getCookieWithJwtAccessToken(request.user.id, true);
		request.res.setHeader('Set-Cookie', [accessTokenCookie]);
		return request.user;
	}
}
