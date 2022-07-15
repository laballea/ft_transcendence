import { Controller, Get, Sse, Query } from '@nestjs/common';
import { interval, Observable, mergeMap } from 'rxjs';
import { UserI } from './models/user.interface';
import { UserService } from './user.service';
import { UserGateway } from './user.gateway';
import { EventsService } from './events.service';
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
	findCon():Object {
		return this.userService.getConnected();
	}

	@Sse('gameStat')
	sse(@Query() query): Observable<any> {
		return interval(1000).pipe(
			mergeMap( async (_) => ({ data: { gameStats: await this.userService.getGameStatByUserId(query.id)} })
		));
	}

	/*
		send to all client who listening to /user/contactList the list of user in db
	*/
	@Sse('contactList')
	sseContact(@Query() query): Observable<any> {
		return interval(1000).pipe(
			mergeMap( async (_) => ({ data: { contactList: await this.userGateway.getContactList(query.username)} })
		));
	}
}