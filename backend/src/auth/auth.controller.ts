import { Body, Controller, Inject, Post, UseGuards, Req, Get, Res, HttpException, HttpStatus} from '@nestjs/common';
import { UserEntity } from '../user/models/user.entity';
import { LoginDto } from './auth.dto';
import { JwtAuthGuard, IntraAuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
	@Inject(AuthService)
	private readonly service: AuthService;

	/*
		receive username, create user if not in db, and return JWT token
	*/
	@Post('login')
	private async login(@Body() body: LoginDto): Promise<Object | never> {
		const resp = await this.service.login(body);
		return resp;
	}
	@Post('validToken')
	private async validToken(@Body() body): Promise<Object | never> {
		const { jwt } = body;
		if (!this.service.validToken(jwt))
			throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
		throw new HttpException('OK', HttpStatus.OK);
	}
	@Post('refresh')
	@UseGuards(JwtAuthGuard)
	private refresh(@Req() { user }: Request): Promise<string | never> {
		return this.service.refresh(<UserEntity>user);
	}

	@Get('/login')
	@UseGuards(IntraAuthGuard)
	loginIntra(@Res() res, @Req() req): any {
		const url = new URL("http://localhost:3000/home");
		url.searchParams.append('id', req.user.id);
		url.searchParams.append('jwt', this.service.createToken(req.user));
		res.redirect(url);
	}
}