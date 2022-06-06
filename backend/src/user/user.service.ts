import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository, getConnection } from 'typeorm';
import { UserEntity, status } from './models/user.entity';
import { UserI, UserSafeInfo } from './models/user.interface';
import { UserP } from './models/user.interface';
@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserEntity)
		private userRepository: Repository<UserEntity>,
	){}

	public connectedUser: UserP[] = [];

	/*
		return list of user store in db
	*/
	findAll():Promise<UserI[]> {
		return this.userRepository.find();
	}

	/*
	return list of user store in db
	*/
	getConnected():any {
		return this.connectedUser;
	}

	/*
		find user by username
	*/
	findOne(username: string):Promise<UserI | undefined> {
		return this.userRepository.findOne({ username });
	}
	/*
		find user by username
	*/
	findUserByIntra(intraID: number):Promise<UserI | undefined> {
		return this.userRepository.findOne({ where:{intraID:intraID} });
	}

	/*
	*/
	addUser(data: {id:number,username:string,socket: any,status:status}) {
		this.connectedUser.push({
			id:data.id,
			username:data.username,
			socket: data.socket,
			status:status.Connected,
		})
	}
}
