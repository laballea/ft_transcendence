import { Controller, Get, StreamableFile, Sse, Query, Post, UseInterceptors, UploadedFile, HttpException, HttpStatus, Req, UseGuards, Param, Res } from '@nestjs/common';
import { interval, Observable, mergeMap } from 'rxjs';
import { UserI } from './models/user.interface';
import { UserService } from './user.service';
import { UserGateway } from './user.gateway';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, Express } from 'multer';
import { JwtAuthGuard } from '../auth/auth.guard';
import { createReadStream, readdirSync} from 'fs';
import { join } from 'path';
import { EventsService } from './events.service';

@Controller('users')
export class UserController {
	constructor(
		private userService:UserService,
		private userGateway:UserGateway,
		private readonly eventsService: EventsService)
		{
			this.lol = 3
		}
		private lol:number
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


	@Post('upload')
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(FileInterceptor('file', {
		limits: {
			fileSize: 10000,
		},
		fileFilter: function(req: any, file: any, cb: any) {
			if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/))
				cb(null, true);
			else
				cb(null, false);
		},
		storage: diskStorage({
			destination: './uploads/profilpic',
			filename:function (req, file, cb) {
				cb(null, file.originalname)
			}
		})
	}))
	uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req) {
		if (file != undefined)
			this.userService.changePic(req.user.id, "http://localhost:5000/users/image/" + file.originalname)
		else {
			const userSocket:any = this.userService.findConnectedUserById(req.user.id)
			this.userGateway.emitPopUp([userSocket], {error:true, message: `Invalide format.`});
		}
	}

	@Get('image/:imgpath')
	seeUploadedFile(@Param('imgpath') image, @Res() res){
		res.contentType('image/png');
		return res.sendFile(image, { root: './uploads/profilpic' });
	}

	@Get('image/')
	@UseGuards(JwtAuthGuard)
	getFile(@Req() req) {
		let res = []
		res.push(req.user.profilIntraUrl)
		let filenames = readdirSync(process.cwd() + '/uploads/profilpic');
		filenames.forEach((file) => {
			res.push("http://localhost:5000/users/image/" + file)
		});
		return res
	}
}