import { Body, Controller, Get, Post, UseGuards, Request, Sse, Logger, Query } from '@nestjs/common';
import { interval, Observable, mergeMap } from 'rxjs';
import { UserI } from './models/user.interface';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { MessageEvent } from '@nestjs/common';
import { EventsService } from './events.service';
  
@Controller('users')
export class UserController {
	constructor(private userService:UserService, private readonly eventsService: EventsService) {}

	/*
		return all user in db
	*/
	@Get()
	@UseGuards(JwtAuthGuard)
	findAll():Promise<UserI[]> {
		return this.userService.findAll();
	}

	/*
		update status of user db
	*/
	@Post('logout')
	@UseGuards(JwtAuthGuard)
	logout(@Request() req):Promise<string> {
		var ret = this.userService.logout(req.user.id);
		return ret;
	}

	/*
		send to all client who listening to /user/contactList the list of user in db
	*/
	@Sse('contactList')
	sse(@Query() query): Observable<any> {
		return interval(1000).pipe(
			mergeMap( async (_) => ({ data: { contactList: await this.userService.getContactList(query.username)} })
		));
	}
}