import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';
import { User, Message, Conversation, status } from './models/user.entity';
import { ConversationI, UserI, UserSafeInfo, UserP } from './models/user.interface';

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
		return this.connectedUser.map(data => ({id:data.id, status:data.status, username:data.username}));
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
	connectUser(data: {id:number,username:string,socket: any,status:status}) {
		const user = this.connectedUser.find((user: any) => {return user.id === data.id})
		if (!user){
			this.connectedUser.push({
				id:data.id,
				username:data.username,
				socket: data.socket,
				status:status.Connected,
			})
		}
		console.log(data.username, "connected");
	}

	/*
	*/
	disconnectUser(socketID:number) {
		const user = this.connectedUser.find((user: any) => {return user.socket.id === socketID})
		if (user) {
			this.connectedUser.splice(this.connectedUser.findIndex(v => v.id === user.id), 1);
			console.log(user.username, "disconnected");
		}
	}

	/*
	*/
	findConnectedUserById(id:number) {
		const user = this.connectedUser.find((user: any) => {return user.id === id})
		if (user)
			return user;
		return null
	}

	/*
	*/
	findConnectedUserBySocketId(socketID:number):UserP {
		const user = this.connectedUser.find((user: any) => {return user.socket.id === socketID})
		if (user)
			return user;
		return null
	}
	/*
	*/
	findConnectedUserByUsername(username:string):UserP {
		const user = this.connectedUser.find((user: any) => {return user.username === username})
		if (user)
			return user;
		return null
	}

	/*
	*/
	getUserStatus(id:number):status {
		const user = this.connectedUser.find((user: any) => {return user.id === id})
		if (user)
			return user.status;
		return status.Disconnected
	}

	/*
	*/
	async updateUserDB(user:User) {
		await getConnection()
			.createQueryBuilder()
			.update(User)
			.set(user)
			.where("id = :id", { id: user.id })
			.execute();
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

	/*
		return more readable user data for client
	*/
	async parseUserInfo(userInfo:User):Promise<UserSafeInfo> {
		console.log('parse user info')
		const userRepo = await this.userRepository.find()
		var UserSafeInfo:UserSafeInfo = {
			id: userInfo.id,
			username: userInfo.username,
			status:this.getUserStatus(userInfo.id),//this.getStatus(userInfo.id),
		};
		UserSafeInfo.friends = userInfo.friends.map(id => ({ id: id, username: userRepo.find(el => el.id == id).username}));
		UserSafeInfo.bloqued = userInfo.bloqued.map(id => ({ id: id, username: userRepo.find(el => el.id == id).username}));
		UserSafeInfo.friendsRequest = userInfo.friendsRequest.map(id => ({ id: id, username: userRepo.find(el => el.id == id).username}));
		
		this.getConversationByUser(userInfo);
		
		return UserSafeInfo;
	}
}
