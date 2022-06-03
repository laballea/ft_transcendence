import { Body, Controller, Inject, Post, ClassSerializerInterceptor, UseInterceptors, UseGuards, Req, Get, Redirect} from '@nestjs/common';
import { UserEntity } from '../user/models/user.entity';
import { RegisterDto, LoginDto } from './auth.dto';
import { JwtAuthGuard } from './auth.guard';
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

	@Post('refresh')
	@UseGuards(JwtAuthGuard)
	private refresh(@Req() { user }: Request): Promise<string | never> {
		return this.service.refresh(<UserEntity>user);
	}
}