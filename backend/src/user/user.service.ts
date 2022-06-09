import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';
import { User, Message, Conversation, status } from './models/user.entity';
import { ConversationI, UserI, UserSafeInfo, UserSocket, MessageI, safeConv } from './models/user.interface';

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

	public connectedUser: UserSocket[] = [];

	/*
		return list of user store in db
	*/
	findAll():Promise<UserI[]> {
		return this.userRepository.find();
	}

	/*
	return list of user store in db
	*/
	async getConnected():Promise<JSON> {
		let res:any = await Promise.all(this.connectedUser.map(async data => {
			let userdb = await this.userRepository.findOne({
				where: {
					id: data.id
				}})
			let res = await this.parseUserInfo(userdb)
			return res
		}))
		return  res
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
	findConnectedUserBySocketId(socketID:number):UserSocket {
		const user = this.connectedUser.find((user: any) => {return user.socket.id === socketID})
		if (user)
			return user;
		return null
	}
	/*
	*/
	findConnectedUserByUsername(username:string):UserSocket {
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

	async getConversationByUserId(id:number):Promise<safeConv[]>{
		var _conv:safeConv[] = [];
		const user = await this.userRepository.findOne({
			relations: ['conversations', 'conversations.messages', 'conversations.users'],
			where: {
				id: id
			}
		})
		if (user){
			for (let conv of user.conversations) {
				_conv.push({
					id:conv.id,
					name:conv.name,
					msg:conv.messages,
					users:conv.users.map(user => ({id:user.id, username:user.username}))
				})
			}
		}
		return _conv;
	}
	/*
		return more readable user data for client
	*/
	async parseUserInfo(userInfo:User):Promise<UserSafeInfo> {
		const userRepo = await this.userRepository.find()
		var UserSafeInfo:UserSafeInfo = {
			id: userInfo.id,
			username: userInfo.username,
			status:this.getUserStatus(userInfo.id),//this.getStatus(userInfo.id),
		};
		UserSafeInfo.friends = userInfo.friends.map(id => ({ id: id, username: userRepo.find(el => el.id == id).username}));
		UserSafeInfo.bloqued = userInfo.bloqued.map(id => ({ id: id, username: userRepo.find(el => el.id == id).username}));
		UserSafeInfo.friendsRequest = userInfo.friendsRequest.map(id => ({ id: id, username: userRepo.find(el => el.id == id).username}));
		UserSafeInfo.conv = await this.getConversationByUserId(userInfo.id);
		
		return UserSafeInfo;
	}
}
