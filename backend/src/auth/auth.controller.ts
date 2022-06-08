import { Body, Controller, Inject, Post, UseGuards, Req, Get, Res, HttpException, HttpStatus} from '@nestjs/common';
import { User } from '../user/models/user.entity';
import { LoginDto } from './auth.dto';
import { JwtAuthGuard, IntraAuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';
import { status } from '../user/models/user.entity';
import { HTTP_STATUS } from 'src/common/types';

@Controller('auth')
export class AuthController {
	@Inject(AuthService)
	private readonly service: AuthService;
	@Inject(UserService)
	private readonly userService: UserService;

	/*
		use for test login
		receive username, create user if not in db, and return JWT token
	*/
	@Post('login')
	private async login(@Body() body: LoginDto): Promise<Object | never> {
		const resp = await this.service.login(body);
		return resp;
	}

	@Post('refresh')
	@UseGuards(JwtAuthGuard)
	private refresh(@Req() { user }: Request): Promise<string | never> {
		return this.service.refresh(<User>user);
	}

	/*
		intra login strategy
		Step1/ call IntraAuthGuard ./auth.guard.ts
		Step2/ IntraAuthGuard extends intra-oauth strategy ./intra.strategy.ts
		Step3/ Framework does everything and we get accessToken/user info. in validate ./intra.strategy.ts
		Step4/ User info. is accessible in req.user, we redirect to home page with new jwt in query
	*/
	@Get('/login')
	@UseGuards(IntraAuthGuard)
	loginIntra(@Res() res, @Req() req): any {
		const url = new URL("http://localhost:3000/login");
		url.searchParams.append('jwt', this.service.createToken(req.user));
		res.redirect(url);
	}

	/*
		Return user corresponding to authorization token
	*/
	@Get('/user')
	@UseGuards(JwtAuthGuard)
	async getUser(@Res() res, @Req() req): Promise<any> {
		if (this.userService.getUserStatus(req.user.id) != status.Disconnected)
			throw new HttpException(HTTP_STATUS.ALREADY_CONNECTED, HttpStatus.CONFLICT);
		res.status(HttpStatus.OK).send(await this.userService.parseUserInfo(req.user));
	}
}
