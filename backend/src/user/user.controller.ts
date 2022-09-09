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
import { User } from './models/user.entity';

@Controller('users')
export class UserController {
	constructor(
		private userService:UserService,
		private userGateway:UserGateway,
		private readonly eventsService: EventsService)
		{
		}
	/*
		return all user in db
	*/
	async getUserLIst(userID:number, usernameSearch:string) {
		const allUsers:User[] = await this.userService.findAll()
		let result = []
		for (let user of allUsers){
			if (user.username.startsWith(usernameSearch) && user.id != userID){
				let truncUser = {
					id:user.id,
					username:user.username,
					profilPic: user.profilPic,
					status:this.userService.getUserStatus(user.id),
					friend:user.friends.includes(Number(userID))
				}
				if (usernameSearch.length > 0 || (usernameSearch.length == 0 && user.friends.includes(Number(userID))))
					result.push(truncUser)
			}
		}
		return result
	}

	@Get('search')
	async findUserByUsername(@Query() query,  @Res() res) {
		res.send(await this.getUserLIst(0, query.username))
	}

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
			mergeMap( async (_) => ({ data: { contactList: await this.getUserLIst(query.id, query.searchUsername)} })
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
		if (req.user.profilIntraUrl != null)
			res.push(req.user.profilIntraUrl)
		let filenames = readdirSync(process.cwd() + '/uploads/profilpic');
		filenames.forEach((file) => {
			res.push("http://localhost:5000/users/image/" + file)
		});
		return res
	}

}