import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard, IAuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { User } from '../user/models/user.entity';
import { HttpException } from '@nestjs/common';
import { HTTP_STATUS } from 'src/common/types';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements IAuthGuard {
	public handleRequest(err: unknown, user: User): any {
		return user;
	}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		await super.canActivate(context);
		const { user }: Request = context.switchToHttp().getRequest();
		return user ? true : false;
	}
}

@Injectable()
export class IntraAuthGuard extends AuthGuard('intra-oauth') {
	constructor() {
		super();
	}

	async canActivate(context: ExecutionContext) {
		const activate = (await super.canActivate(context)) as boolean;
		const request = context.switchToHttp().getRequest();
		await super.logIn(request);
		return activate;
	}

	handleRequest(err: any, user: any) {
		if (err || !user) {
			console.log("ca bloque", user, err)
			throw new HttpException(HTTP_STATUS.LOGIN_FAILED, err.status);
		}
		return user;
	}
}
