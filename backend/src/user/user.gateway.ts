import { Logger } from '@nestjs/common';
import { UserP } from './models/user.interface';
import {
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	ConnectedSocket
} from '@nestjs/websockets';
import {
	Repository,
	getConnection,
	getRepository
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation, Message, User } from './models/user.entity';
import { status } from './models/user.entity';
import { FRIEND_REQUEST_ACTIONS, FRIEND_REQUEST_DATA, MESSAGE_DATA } from 'src/common/types';
import { UserService } from './user.service';
import { Inject } from '@nestjs/common';
import { truncateString } from 'src/common/utils';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({
	cors: {
		origin: '*',
	},
})

@WebSocketGateway()
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
		@InjectRepository(Message)
		private messageRepository: Repository<Message>,
		@InjectRepository(Conversation)
		private convRepository: Repository<Conversation>,
		private userService:UserService
	){}

	public connectedUser: UserP[] = [];

	@WebSocketServer()
	server: Server;

	handleConnection(client: any) {
		if (!this.server) this.server = client.server;
	};
	afterInit(server: any) {}

	async handleDisconnect(client: any, ...args: any[]) {
		this.userService.disconnectUser(client.id) // client.id = socket.id
	}
	@SubscribeMessage('CONNECT')
	async connect(@MessageBody() data: {socketID:string, id:number, username:string}, @ConnectedSocket() client: any) {
		this.userService.connectUser(
			{
				id:data.id,
				username:data.username,
				socket: client,
				status:status.Connected,
			}
		)
	}

	@SubscribeMessage('FRIEND_REQUEST')
	async addFriend(@MessageBody() data: FRIEND_REQUEST_DATA) {
		try {
			/* Find if clients are connected*/
			const user_emit = this.userService.findConnectedUserByUsername(data.client_emit);
			const user_recv = this.userService.findConnectedUserByUsername(data.client_recv);

			/* find user in db */
			const db_user_emit = await this.userRepository.findOne({ where:{username:data.client_emit} })
			const db_user_recv = await this.userRepository.findOne({ where:{username:data.client_recv} })

			if (!db_user_recv){
				return this.emitPopUp([user_emit], true, `User ${truncateString(data.client_recv, 10)} does not exist.`);
			}
			switch (data.action){
				case FRIEND_REQUEST_ACTIONS.ADD: {
					if ((db_user_recv.friendsRequest.length == 0 || !db_user_recv.friendsRequest.includes(db_user_emit.id)) && !db_user_recv.friends.includes(db_user_emit.id))
						db_user_recv.friendsRequest.push(db_user_emit.id);
					
					this.emitPopUp([user_emit], false, `Friend request send to ${truncateString(data.client_recv, 10)}.`);
					break ;
				}
				case FRIEND_REQUEST_ACTIONS.ACCEPT: {
					if (db_user_recv.friends.length == 0 || !db_user_recv.friends.includes(db_user_emit.id))
						db_user_recv.friends.push(db_user_emit.id);
					if (db_user_emit.friends.length == 0 || !db_user_emit.friends.includes(db_user_recv.id))
						db_user_emit.friends.push(db_user_recv.id);
					if (db_user_emit.friendsRequest.includes(db_user_recv.id))
						db_user_emit.friendsRequest.splice(db_user_emit.friendsRequest.indexOf(db_user_recv.id));
				}
				case FRIEND_REQUEST_ACTIONS.DECLINE: {
					if (db_user_emit.friendsRequest.includes(db_user_recv.id))
						db_user_emit.friendsRequest.splice(db_user_emit.friendsRequest.indexOf(db_user_recv.id));
				}
			}
			/* update both user db */
			this.userService.updateUserDB(db_user_recv);
			this.userService.updateUserDB(db_user_emit);
			if (user_recv)
				user_recv.socket.emit('UPDATE_DB', await this.userService.parseUserInfo(db_user_recv))
			if (user_emit)
				user_emit.socket.emit('UPDATE_DB', await this.userService.parseUserInfo(db_user_emit))
		}
		catch (e){
			console.log(e);
		}
	}

	/*
		return array of object with id, username and status
	*/
	async getContactList(username: string):Promise<{ id: number; username: string; }[]>{
		const list = await this.userRepository.find(); // retrieve all users in db
		const user: User = await this.userRepository.findOne({ where:{username:username} }); // find user by his username
		
		return user.friends.map(id => ({ id: id, username: list.find(el => el.id == id).username, status:this.userService.getUserStatus(list.find(el => el.id == id).id)}));
	}

	emitPopUp(users:UserP[], error:boolean, message:string):void{
		for (let user of users) {
			user.socket.emit("PopUp", {message:message, error:error});
		}
	}
	@SubscribeMessage('dmServer')
	async handleDM(@MessageBody() data: MESSAGE_DATA) {
		// Find socket user
		const user_emit = this.connectedUser.find((user: any) => {return user.username === data.client_emit})
		const user_recv = this.connectedUser.find((user: any) => {return user.username === data.client_recv})

		// Find user info
		const db_user_emit :User = await this.userRepository.findOne({ where:{username:data.client_emit} })
		const db_user_recv :User = await this.userRepository.findOne({ where:{username:data.client_recv} })
		
		let conv : Conversation = await this.convRepository.findOne({ 
			where: {
				id: data.conversationID
			},
		})
		if (!conv){
			const conv = new Conversation();
			conv.users = [db_user_emit, db_user_recv];
			await this.convRepository.save(conv);
			console.log("Create conversation")
		}

		// Create new msg
		let msg = new Message();
		msg.content = data.content;
		msg.date = new Date();
		msg.idSend = db_user_emit.id;
		msg.idRecv = db_user_recv.id;
		msg.conversation = conv;
		this.messageRepository.save(msg);

		// Get conv by User
		const tmpEmit = await this.userRepository.find({
			relations: ['conversations'],
			where: {
				id: db_user_emit.id
			}
		})
		const tmpRecv = await this.userRepository.find({
			relations: ['conversations'],
			where: {
				id: db_user_recv.id
			}
		})

		const tmpTEST = await this.messageRepository.find({
			where: {
				conversation: 1
			}
		})


		console.log("EMIT: ", tmpEmit[0].conversations[0], "RECV: ", tmpRecv[0].conversations, "tmpTEST: ", tmpTEST);
		if (user_emit && user_recv) {
			user_emit.socket.emit('dmClient', data.client_emit, data.content, msg.date.toLocaleTimeString('fr-EU'))
			user_recv.socket.emit('dmClient', data.client_emit, data.content, msg.date.toLocaleTimeString('fr-EU'))
		}
	}
}
