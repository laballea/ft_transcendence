import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard, IAuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UserEntity } from '../user/models/user.entity';
import { HttpException } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements IAuthGuard {
  public handleRequest(err: unknown, user: UserEntity): any {
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
		console.log(user)
		if (err || !user) {
			throw new HttpException('failed to login', err.status);
		}
		return user;
	}
}