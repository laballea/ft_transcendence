import { Body, Controller, Get, Post, UseGuards, Request, Sse, Logger, Query, Delete } from '@nestjs/common';
import { interval, Observable, mergeMap } from 'rxjs';
import { UserI } from './models/user.interface';
import { UserService } from './user.service';
import { UserGateway } from './user.gateway';
import { JwtAuthGuard } from '../auth/auth.guard';
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

	/*
		update status of user db
	*/
	@Post('logout')
	@UseGuards(JwtAuthGuard)
	logout(@Request() req):Promise<string> {
		var ret = this.userService.updateStatus(req.user.id,status.Disconnected);
		return ret;
	}

	/*
		update status of user db
	*/
	@Post('friend')
	@UseGuards(JwtAuthGuard)
	addFriend(@Request() req, @Body() body):string {
		this.userGateway.friendRequest({id:req.user.id, friendID:body.friendID})
		/*var ret = this.userService.addFriend({username:req.username, friend_id:req.friend_id});*/
		return "lol";
	}

	/*
		update status of user db
	*/
	@Delete('friend')
	@UseGuards(JwtAuthGuard)
	removeFriend(@Request() req):Promise<string> {
		var ret = this.userService.removeFriend({id:req.user.id, friend_id:req.friend_id});
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