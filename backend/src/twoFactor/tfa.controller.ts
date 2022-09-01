import {
	ClassSerializerInterceptor,
	Controller,
	Get,
	Post,
	UseInterceptors,
	UseGuards,
	Req,
	HttpStatus,
	Res,
	Body,
	UnauthorizedException, HttpCode, Redirect,
} from '@nestjs/common';
import { TwoFactorAuthenticationService } from './tfa.service';
import {IntraAuthGuard, JwtAuthGuard} from '../auth/auth.guard';
import RequestWithUser from '../auth/requestWithUser.interface';
import { TwoFactorAuthenticationCodeDto } from '../auth/auth.dto'
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { Response } from 'express';
import { Code } from 'typeorm';


@Controller('2fa')
export class TwoFactorAuthenticationController {
	constructor(
		private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
		private readonly userService: UserService,
		private readonly authenticationService: AuthService,
	) {}

	// generate code for authApp and display qrCode
	@Post('generate')
	@UseGuards(JwtAuthGuard)
	async register(@Res() response: Response, @Req() request: RequestWithUser) {
		const { otpauthUrl } = await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(request.user);
		console.log("optauthurl", otpauthUrl)
		return this.twoFactorAuthenticationService.pipeQrCodeStream(response, otpauthUrl);
	}

	// if the code send by user is valid: turn on 2fa
	@Post('turn-on')
	@UseGuards(JwtAuthGuard)
	async turnOnTwoFactorAuthentication(@Req() request: RequestWithUser, @Body() { code } : TwoFactorAuthenticationCodeDto) {
		try {
			console.log("CODE", code)
			console.log("REQUEST", request.user)
			const isCodeValid = this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(code, request.user);
			if (!isCodeValid) {
				throw new UnauthorizedException('Wrong authentication code');
			}
			await this.userService.turnOnTwoFactorAuthentication(request.user.id);
		} catch (error) {
			console.error(error)
		}
	}

	// @Post('turn-off')Redirect(@Res() res)
	// 		console.log("CODE", code)
	// 		console.log("REQUEST", request.user)
	// 		const isCodeValid = this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(code, request.user);
	// 		if (!isCodeValid) {
	// 			throw new UnauthorizedException('Wrong authentication code');
	// 		}
	// 		await this.userService.turnOffTwoFactorAuthentication(request.user.id);
	// 	} catch (error) {
	// 		console.error(error)
	// 	}
	// }


	// route that allows the user to send the 2fa code.
	@Post('authenticate')
	//@UseGuards(JwtAuthGuard)
	async authenticate(@Req() req: RequestWithUser, @Body() { code, id }): Promise<Object | never> {
		let user = await this.userService.getById(id)
		const isCodeValid = this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(code, user);
		if (!isCodeValid) {
			throw new UnauthorizedException('Wrong authentication code');
		}
		console.log(user)
		return {token:this.authenticationService.createToken(user)}
	}
}
