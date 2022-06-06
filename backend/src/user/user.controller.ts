import { Body, Controller, Get, Post, UseGuards, Request, Sse, Logger, Query, Delete } from '@nestjs/common';
import { interval, Observable, mergeMap } from 'rxjs';
import { UserI } from './models/user.interface';
import { UserService } from './user.service';
import { UserGateway } from './user.gateway';
import { JwtAuthGuard, IntraAuthGuard } from '../auth/auth.guard';
import { MessageEvent } from '@nestjs/common';
import { EventsService } from './events.service';
import { status } from './models/user.entity';
@Controller('users')
export class UserController {
	constructor(private userService:UserService, private userGateway:UserGateway, private readonly eventsService: EventsService) {}

	/*
		return all user in db
	*/
	@Get()
	findAll():Promise<UserI[]> {
		return this.userService.findAll();
	}

	@Get('connected')
	findConnected():Object {
		return this.userGateway.connectedUser.map(data => ({id:data.id, status:data.status, username:data.username}));
	}
	@Get('test')
	findCon():Object {
		return this.userService.getConnected();
	}
	/*
		send to all client who listening to /user/contactList the list of user in db
	*/
	@Sse('contactList')
	sse(@Query() query): Observable<any> {
		return interval(1000).pipe(
			mergeMap( async (_) => ({ data: { contactList: await this.userGateway.getContactList(query.username)} })
		));
	}
}