import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository, getConnection } from 'typeorm';
import { User, Message, Conversation, status } from './models/user.entity';
import { ConversationI, UserI, UserSafeInfo } from './models/user.interface';
import { friendEvent } from 'src/common/types';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
		@InjectRepository(Conversation)
		private convRepository: Repository<Conversation>,
		@InjectRepository(Message)
		private messageRepository: Repository<Message>,
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
			.update(User)
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
		const user: User = await this.userRepository.findOne({ where:{username:username} });
		return user.friends.map(id => ({ id: id, username: list.find(el => el.id == id).username, status:list.find(el => el.id == id).status}));

		/*list.splice(list.findIndex(object => {return object.username === username}), 1); // remove current user from list
		return list.map(id => ({ id: id, username: userRepo.find(el => el.id == id).username}));*/
	}

	/*
		add friend to user list
	*/
	async addFriend(data: friendEvent):Promise<string> {
		const user: User = await this.userRepository.findOne({ where:{id:data.id} });
		const user2: User = await this.userRepository.findOne({ where:{id:data.friend_id} });
		user.friends.push(user2.id)
		await getConnection()
			.createQueryBuilder()
			.update(User)
			.set({ friends: user.friends })
			.where("id = :id", { id: data.id })
			.execute();
		return "ok";
	}

	/*
		remove friend from user list
	*/
	async removeFriend(data: friendEvent):Promise<string> {
		const user: User = await this.userRepository.findOne({ where:{id:data.id} });
		const user2: User = await this.userRepository.findOne({ where:{id:data.friend_id} });
		user.friends.splice(user.friends.indexOf(user2.id))
		await getConnection()
			.createQueryBuilder()
			.update(User)
			.set({ friends: user.friends })
			.where("id = :id", { id: data.id })
			.execute();
		return "ok";
	}

	async getConversationByUser(userInfo:User):Promise<ConversationI>{
		var res: ConversationI;

		const convUser = await this.userRepository.find({
			relations: ['conversations'],
			where: {
				id: userInfo.id
			}
		})
	
		// iter on conversations id
		const msgConv = await this.messageRepository.find({
			where: {
				conversation: 1
			}
		})
		console.log("convUser: ", convUser[0].conversations[0], "msgConv: ", msgConv);
		return res;
	}

	async parseUserInfo(userInfo:User):Promise<UserSafeInfo> {
		const userRepo = await this.userRepository.find()
		var UserSafeInfo:UserSafeInfo = {
			id: userInfo.id,
			username: userInfo.username
		};
		UserSafeInfo.friends = userInfo.friends.map(id => ({ id: id, username: userRepo.find(el => el.id == id).username}));
		UserSafeInfo.bloqued = userInfo.bloqued.map(id => ({ id: id, username: userRepo.find(el => el.id == id).username}));
		UserSafeInfo.friendsRequest = userInfo.friendsRequest.map(id => ({ id: id, username: userRepo.find(el => el.id == id).username}));
		
		this.getConversationByUser(userInfo);
		
		return UserSafeInfo;
	}
}
