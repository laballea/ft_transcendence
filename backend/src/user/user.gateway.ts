import { UserSocket } from './models/user.interface';
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
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation, Message, User } from './models/user.entity';
import { status } from 'src/common/types';
import { FIND_GAME_DATA, FRIEND_REQUEST_ACTIONS, FRIEND_REQUEST_DATA, MESSAGE_DATA, POPUP_DATA } from 'src/common/types';
import { UserService } from './user.service';
import { truncateString } from 'src/common/utils';
import { Server } from 'socket.io';
import { FriendsService } from 'src/friends/friends.service';
import { GameService } from 'src/game/game.service';

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

		private userService:UserService,
		private friendsService:FriendsService,
		private gameService:GameService
	){}

	public connectedUser: UserSocket[] = [];

	@WebSocketServer()
	server: Server;

	handleConnection(client: any) {
		if (!this.server) this.server = client.server;
	};
	afterInit(server: any) {}

	async handleDisconnect(client: any, ...args: any[]) {
		this.gameService.disconnectUser(this.userService.findConnectedUserBySocketId(client.id))
		this.userService.disconnectUser(client.id) // client.id = socket.id
	}
	@SubscribeMessage('CONNECT')
	async connect(@MessageBody() data: {socketID:string, id:number, username:string}, @ConnectedSocket() client: any) {
		let gameID = this.gameService.reconnect(data.id)
		this.userService.connectUser(
			{
				id:data.id,
				username:data.username,
				socket: client,
				status:status.Connected,
				gameID
			}
		)
		client.emit("UPDATE_DB", await this.userService.parseUserInfo(data.id))
	}

	@SubscribeMessage('FRIEND_REQUEST')
	async addFriend(@MessageBody() data: FRIEND_REQUEST_DATA) {
		try {
			/* Find if clients are connected*/
			const user_send:UserSocket = this.userService.findConnectedUserByUsername(data.client_send);
			const user_recv:UserSocket = this.userService.findConnectedUserByUsername(data.client_recv);

			/* find user in db */
			const db_user_send = await this.userRepository.findOne({ where:{username:data.client_send} })
			const db_user_recv = await this.userRepository.findOne({ where:{username:data.client_recv} })

			/*
				_send = user who emit on server
				_recv = to who _send emit
			*/
			if (!db_user_recv){
				return this.emitPopUp([user_send], {error:true, message: `User ${truncateString(data.client_recv, 10)} does not exist.`});
			}
			switch (data.action){
				case FRIEND_REQUEST_ACTIONS.ADD: {
					this.emitPopUp([user_send], this.friendsService.add(db_user_send, db_user_recv));
					break ;
				}
				case FRIEND_REQUEST_ACTIONS.ACCEPT: {
					this.friendsService.accept(db_user_send, db_user_recv);
					break;
				}
				case FRIEND_REQUEST_ACTIONS.DECLINE: {
					this.friendsService.decline(db_user_send, db_user_recv);
					break;
				}
				case FRIEND_REQUEST_ACTIONS.REMOVE: {
					this.emitPopUp([user_send], this.friendsService.remove(db_user_send, db_user_recv));
					break;
				}
			}
			/* update both user db */
			this.userService.updateUserDB(db_user_recv);
			this.userService.updateUserDB(db_user_send);
			if (user_recv)
				user_recv.socket.emit('UPDATE_DB', await this.userService.parseUserInfo(db_user_recv.id))
			if (user_send)
				user_send.socket.emit('UPDATE_DB', await this.userService.parseUserInfo(db_user_send.id))
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

	emitPopUp(users:UserSocket[], data:POPUP_DATA):void{
		for (let user of users) {
			user.socket.emit("PopUp", {message:data.message, error:data.error});
		}
	}

	@SubscribeMessage('dmServer')
	async handleDM(@MessageBody() data: MESSAGE_DATA) {
		const user_send:UserSocket = this.userService.findConnectedUserByUsername(data.client_send);
		const db_user_send:User = await this.userRepository.findOne({ where:{username:data.client_send}})
		
		if (data.client_recv == undefined && data.conversationID && data.conversationID < 0)
			return this.emitPopUp([user_send], {error:true, message: `Message can't be sent.`});
			
		const db_user_recv:User = await this.userRepository.findOne({ where:{username:data.client_recv} })

		/* does conversation exist else create it */
		let conv : Conversation = await this.convRepository.findOne({
			relations:["users"],
			where: {
				id: data.conversationID
			},
		})
		if (!conv && db_user_recv != undefined){
			conv = new Conversation();
			conv.users = [db_user_send, db_user_recv];
			conv.name = db_user_recv.username
			await this.convRepository.save(conv);
		} else if (!conv && db_user_recv == undefined)
			return this.emitPopUp([user_send], {error:true, message: `User ${data.client_recv} does not exist.`});

		/* create new message, save it, update conv */
		let msg = new Message();
		msg.content = data.content;
		msg.date = new Date().toUTCString();
		msg.idSend = db_user_send.id;
		msg.author = db_user_send.username;
		msg.conversation = conv;
		await this.messageRepository.save(msg);
		await this.convRepository.save(conv);

		for (let idx in conv.users){
			let userSocket = this.userService.findConnectedUserByUsername(conv.users[idx].username)
			if (userSocket)
				userSocket.socket.emit('UPDATE_DB', await this.userService.parseUserInfo(conv.users[idx].id))
		}
	}

	@SubscribeMessage('FIND_GAME')
	async findGame(@MessageBody() data: FIND_GAME_DATA) {
		const user_send:UserSocket = this.userService.findConnectedUserByUsername(data.client_send);
		if (user_send != undefined){
			if (!this.gameService.addToQueue(user_send))
				return this.emitPopUp([user_send], {error:true, message: `${data.client_send} already in queue.`});
			this.emitPopUp([user_send], {error:false, message: `Succesfully added ${data.client_send} to queue.`});
			user_send.status = status.InQueue
			let otherID = this.gameService.findOtherPlayer(user_send)
			if (otherID != -1){
				const otherUser:UserSocket = this.userService.findConnectedUserById(otherID);
				if (otherUser){
					let gameID = this.gameService.createGame([user_send, otherUser])
					this.emitPopUp([user_send,otherUser], {error:false, message: `Game founded.`});
					this.server.to(gameID).emit("GAME_FOUND", {gameID:gameID})
					this.gameService.findGame(gameID).game.game()
					this.gameService.removeFromQueue(user_send.id)
					this.gameService.removeFromQueue(otherUser.id)
				}
			}
		}
	}

	@SubscribeMessage('KEYPRESS')
	async keyPress(@MessageBody() data: {dir:string,id:number, on:boolean,gameID:string,jwt:string}) {
		this.gameService.findGame(data.gameID).game.keyPress(data.id, data.dir == "ArrowUp" ? -1 : 1, data.on)
	}
}
