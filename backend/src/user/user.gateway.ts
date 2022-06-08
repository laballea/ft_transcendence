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

	private logger: Logger = new Logger("UserGateway");
	public connectedUser: UserP[] = [];

	@WebSocketServer()
	server: Server;

	handleConnection(client: Socket) {
	}

	async handleDisconnect(client: Socket, ...args: any[]) {
		const user_idx = this.connectedUser.findIndex(v => v.socket.id === client.id)
		if (this.connectedUser[user_idx]) {
			console.log(this.connectedUser[user_idx].username, "disconnected");
			await getConnection()
				.createQueryBuilder()
				.update(User)
				.set({ status: status.Disconnected })
				.where("id = :id", { id: this.connectedUser[user_idx].id })
				.execute();
			this.connectedUser.splice(user_idx, 1);
		}
	}

	afterInit(server: Server) {
		console.log('Socket is live')
		this.logger.log("Socket is live")
	}

	@SubscribeMessage('CONNECT')
	async connect(@MessageBody() data: {socketID:string, id:number, username:string}, @ConnectedSocket() client: Socket) {
		this.connectedUser.push({
			id:data.id,
			username:data.username,
			socket: client
		})
		await getConnection()
			.createQueryBuilder()
			.update(User)
			.set({ status: status.Connected })
			.where("id = :id", { id: data.id })
			.execute();
		console.log(data.username, "connected");
	}

	@SubscribeMessage('FRIEND_REQUEST')
	async addFriend(@MessageBody() data: FRIEND_REQUEST_DATA) {
		try {
			/* Is client receiving friend request connected */
			const user_recv = this.connectedUser.find((user: any) => {return user.username === data.client_recv})
			const db_user_recv = await this.userRepository.findOne({ where:{username:data.client_recv} })
			const user_emit = this.connectedUser.find((user: any) => {return user.username === data.client_emit})
			const db_user_emit = await this.userRepository.findOne({ where:{username:data.client_emit} })

			switch (data.action){
				case FRIEND_REQUEST_ACTIONS.ADD: {
					if ((db_user_recv.friendsRequest.length == 0 || !db_user_recv.friendsRequest.includes(db_user_emit.id)) && !db_user_recv.friends.includes(db_user_emit.id))
						db_user_recv.friendsRequest.push(db_user_emit.id);
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
			await getConnection()
				.createQueryBuilder()
				.update(User)
				.set(db_user_recv)
				.where("id = :id", { id: db_user_recv.id })
				.execute();
			await getConnection()
				.createQueryBuilder()
				.update(User)
				.set(db_user_emit)
				.where("id = :id", { id: db_user_emit.id })
				.execute();
			if (user_recv)
				user_recv.socket.emit('UPDATE_DB', await this.userService.parseUserInfo(db_user_recv))
			if (user_emit)
				user_emit.socket.emit('UPDATE_DB', await this.userService.parseUserInfo(db_user_emit))
		}
		catch (e){
			console.log(e);
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

		// Search existant conv or create it
		let conv : Conversation = await this.convRepository.findOne({ 
			where: {
				//id: data.conversation.id
				id: 1
				// users: [db_user_emit.id]
			},
		})

		if (!conv) {
			console.log('ntm')
			conv = new Conversation();
			//conv.id = 68;
			conv.users = [db_user_emit, db_user_recv];
		}

		// Create new msg
		let hour: Date = new Date()
		let msg = new Message();
		msg.content = data.content;
		msg.date = hour;
		msg.idSend = db_user_emit.id;
		msg.idRecv = db_user_recv.id;
		msg.conversation = conv;
		this.messageRepository.save(msg);

		// conv.messages.push(msg);
		// this.convRepository.save(conv);

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
