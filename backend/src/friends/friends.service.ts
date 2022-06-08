import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { UserService } from 'src/user/user.service';
import { Repository, getConnection } from 'typeorm';
import { User } from '../user/models/user.entity';

@Injectable()
export class FriendsService {
	constructor(
		@Inject(UserService)
		private userService: UserService,
	){}

	isFriend(){
		
	}
}
