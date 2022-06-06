import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository, getConnection } from 'typeorm';
import { UserEntity, status } from './models/user.entity';
import { UserI, UserSafeInfo } from './models/user.interface';
import { friendEvent } from 'src/common/types';
@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserEntity)
		private userRepository: Repository<UserEntity>
	){}

	/*
		return list of user store in db
	*/
	findAll():Promise<UserI[]> {
		return this.userRepository.find();
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
		update user status to Disconnected
	*/
	async updateStatus(id: number, status:status):Promise<string> {
		await getConnection()
			.createQueryBuilder()
			.update(UserEntity)
			.set({ status: status })
			.where("id = :id", { id: id })
			.execute();
		return "ok";
	}

	/*
		return list of user in db without current user
	*/
	async getContactList(username: string):Promise<{ id: number; username: string; }[]>{
		const list = await this.userRepository.find();
		const user: UserEntity = await this.userRepository.findOne({ where:{username:username} });
		return user.friends.map(id => ({ id: id, username: list.find(el => el.id == id).username, status:list.find(el => el.id == id).status}));

		/*list.splice(list.findIndex(object => {return object.username === username}), 1); // remove current user from list
		return list.map(id => ({ id: id, username: userRepo.find(el => el.id == id).username}));*/
	}

	/*
		add friend to user list
	*/
	async addFriend(data: friendEvent):Promise<string> {
		const user: UserEntity = await this.userRepository.findOne({ where:{id:data.id} });
		const user2: UserEntity = await this.userRepository.findOne({ where:{id:data.friend_id} });
		user.friends.push(user2.id)
		await getConnection()
			.createQueryBuilder()
			.update(UserEntity)
			.set({ friends: user.friends })
			.where("id = :id", { id: data.id })
			.execute();
		return "ok";
	}

	/*
		remove friend from user list
	*/
	async removeFriend(data: friendEvent):Promise<string> {
		const user: UserEntity = await this.userRepository.findOne({ where:{id:data.id} });
		const user2: UserEntity = await this.userRepository.findOne({ where:{id:data.friend_id} });
		user.friends.splice(user.friends.indexOf(user2.id))
		await getConnection()
			.createQueryBuilder()
			.update(UserEntity)
			.set({ friends: user.friends })
			.where("id = :id", { id: data.id })
			.execute();
		return "ok";
	}

	async parseUserInfo(userInfo:UserEntity):Promise<UserSafeInfo> {
		const userRepo = await this.userRepository.find()
		var UserSafeInfo:UserSafeInfo = {
			id: userInfo.id,
			username: userInfo.username
		};
		UserSafeInfo.friends = userInfo.friends.map(id => ({ id: id, username: userRepo.find(el => el.id == id).username}));
		UserSafeInfo.bloqued = userInfo.bloqued.map(id => ({ id: id, username: userRepo.find(el => el.id == id).username}));
		UserSafeInfo.friendsRequest = userInfo.friendsRequest.map(id => ({ id: id, username: userRepo.find(el => el.id == id).username}));
		return UserSafeInfo;
	}
}
