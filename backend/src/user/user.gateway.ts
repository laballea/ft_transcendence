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
	getConnection
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation, Message, User, Room } from './models/user.entity';
import { gamemode, status } from 'src/common/types';
import { FRIEND_REQUEST_ACTIONS,
	FRIEND_REQUEST_DATA,
	MESSAGE_DATA,
	POPUP_DATA,
	ROOM_DATA,
	NEW_MEMBER,
	FIND_GAME_DATA
} from 'src/common/types';
import { UserService } from './user.service';
import { truncateString } from 'src/common/utils';
import { Server } from 'socket.io';
import { FriendsService } from 'src/friends/friends.service';
import { GameService } from 'src/game/game.service';
import * as bcrypt from 'bcrypt';

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
		@InjectRepository(Room)
		private roomRepository: Repository<Room>,

		private userService:UserService,
		private friendsService:FriendsService,
		private gameService:GameService
	){}

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
		this.userService.connectUser(
			{
				id:data.id,
				username:data.username,
				socket: client,
				status:status.Connected,
				gameID:undefined
			}
		)
		let user = this.userService.findConnectedUserById(data.id)
		user.gameID = this.gameService.reconnect(data.id)
		user.status = user.gameID ? status.InGame : user.status
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
			await this.userService.updateUserDB([db_user_recv, db_user_send]);
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
		const db_user_send:User = await this.userRepository.findOne({ where:{username:data.client_send} })
		
		if (data.client_recv == undefined && (!data.conversationID || data.conversationID < 0))
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

	@SubscribeMessage('newChatRoom')
	async handleRoom(@MessageBody() data: ROOM_DATA) {
		const user_send: UserSocket = this.userService.findConnectedUserByUsername(data.admin);
		const db_user_send: User = await this.userRepository.findOne({ where:{username:data.admin} })
		/* does Room exist else create it */
		let room : Room = await this.roomRepository.findOne({ where:{name: data.name} })
		if (!room) {
			room = new Room();
			room.name = data.name;
			room.password = await bcrypt.hash(data.password, 10);
			room.adminId = db_user_send.id;
			room.users = [db_user_send];
			await this.roomRepository.save(room);
			user_send.socket.emit('UPDATE_DB', await this.userService.parseUserInfo(db_user_send.id))
		}
		else {
			return this.emitPopUp([user_send], {error:true, message: `Room name ${data.name} already exist.`});
		}
	}

	@SubscribeMessage('addMember')
	async addMember(@MessageBody() data: NEW_MEMBER) {
		const admin: UserSocket = this.userService.findConnectedUserByUsername(data.admin);
		const db_admin: User = await this.userRepository.findOne({ where:{username:data.admin} })
		let room : Room = await this.roomRepository.findOne({
			where:{id: data.roomId},
			relations:['users', 'users.rooms'],
		})
		let newUser:User = await this.userRepository.findOne({ where:{username:data.user} })
		if (!room || !newUser)
			return this.emitPopUp([admin], {error:true, message: `User ${data.user} doesn't exist.`});
		room.users.push(newUser)
		await this.roomRepository.save(room);
		for (let idx in room.users){
			let userSocket = this.userService.findConnectedUserByUsername(room.users[idx].username)
			if (userSocket)
				userSocket.socket.emit('UPDATE_DB', await this.userService.parseUserInfo(room.users[idx].id))
		}
	}

	@SubscribeMessage('deleteRoom')
	async deleteRoom(@MessageBody() data: {roomId: number, user: string}) {
		const db_user: User = await this.userRepository.findOne({ where:{username:data.user} })
		let room : Room = await this.roomRepository.findOne({
			where:{id: data.roomId},
			relations:['users', 'users.rooms'],
		})
		//delete msg then delete room
		await getConnection()
		.createQueryBuilder()
		.delete()
		.from(Message)
		.where("roomId = :roomId", { roomId: data.roomId })
		.execute();
		//delete room empty
		await getConnection()
		.createQueryBuilder()
		.delete()
		.from(Room)
		.where("id = :id", { id: data.roomId })
		.andWhere("adminId = :adminId", {adminId: db_user.id})
		.execute();
		for (let idx in room.users){
			let userSocket = this.userService.findConnectedUserByUsername(room.users[idx].username)
			if (userSocket)
				userSocket.socket.emit('UPDATE_DB', await this.userService.parseUserInfo(room.users[idx].id))
		}
	}

	@SubscribeMessage('joinRoom')
	async joinRoom(@MessageBody() data: {joinRoom:string, passRoom:string, user:string}) {
		const user: UserSocket = this.userService.findConnectedUserByUsername(data.user);
		const newUser: User = await this.userRepository.findOne({ where:{username:data.user} })
		let room : Room = await this.roomRepository.findOne({
			where:{name: data.joinRoom},
			relations:['users', 'users.rooms'],
		})
		if (!room)
			return this.emitPopUp([user], {error:true, message: `Room doesn't exist !`});
		else if (!bcrypt.compare(data.passRoom, room.password))
			return this.emitPopUp([user], {error:true, message: `Password doesn't match with the room !`});
		room.users.push(newUser)
		await this.roomRepository.save(room);
		for (let idx in room.users){
			let userSocket = this.userService.findConnectedUserByUsername(room.users[idx].username)
			if (userSocket)
				userSocket.socket.emit('UPDATE_DB', await this.userService.parseUserInfo(room.users[idx].id))
		}
	}

	@SubscribeMessage('deleteMember')
	async deleteMember(@MessageBody() data: {roomId: number, userId: number, admin: string}) {
		const db_admin: User = await this.userRepository.findOne({ where:{username:data.admin} })
		if (data.userId == db_admin.id)
			this.deleteRoom({roomId: data.roomId, user: data.admin})
		else {
			let room : Room = await this.roomRepository.findOne({
				where:{id: data.roomId},
				relations:['users', 'users.rooms'],
			})
			await getConnection()
			.createQueryBuilder()
			.relation(Room, "users")
			.of(data.roomId)
			.remove(data.userId)
			for (let idx in room.users){
				let userSocket = this.userService.findConnectedUserByUsername(room.users[idx].username)
				if (userSocket)
					userSocket.socket.emit('UPDATE_DB', await this.userService.parseUserInfo(room.users[idx].id))
			}
		}
	}

	@SubscribeMessage('roomMsg')
	async handleRoomMsg(@MessageBody() data: MESSAGE_DATA) {
		const user_send:UserSocket = this.userService.findConnectedUserByUsername(data.client_send);
		const db_user_send:User = await this.userRepository.findOne({ where:{username:data.client_send} })

		/* does conversation exist else create it */
		let room : Room = await this.roomRepository.findOne({
			relations:["users"],
			where: {
				id: data.conversationID
			},
		})

		/* create new message, save it, update room */
		let msg = new Message();
		msg.content = data.content;
		msg.date = new Date().toUTCString();
		msg.idSend = db_user_send.id;
		msg.author = db_user_send.username;
		msg.room = room;
		await this.messageRepository.save(msg);
		await this.roomRepository.save(room);

		for (let idx in room.users){
			let userSocket = this.userService.findConnectedUserByUsername(room.users[idx].username)
			if (userSocket)
				userSocket.socket.emit('UPDATE_DB', await this.userService.parseUserInfo(room.users[idx].id))
		}
	}

	// @SubscribeMessage('turn-2fa')
	// async set2fa(@MessageBody() username: string) {
	// 	const user:User = await this.userRepository.findOne({ where:{username: username} })
	// 	this.userService.turnOnTwoFactorAuthentication(user.id);
	// }

	/*
		add user to queue
		try to find another user
		create & launch game if finded
	*/
	@SubscribeMessage('FIND_GAME')
	async findGame(@MessageBody() data: FIND_GAME_DATA) {
		try {
			const user_send:UserSocket = this.userService.findConnectedUserByUsername(data.client_send);
			if (user_send != undefined){
				if (!this.gameService.addToQueue(user_send, data.mode)) // add User to queue
					return this.emitPopUp([user_send], {error:true, message: `${data.client_send} already in queue.`});
				this.emitPopUp([user_send], {error:false, message: `Succesfully added ${data.client_send} to queue.`});
				user_send.status = status.InQueue
				const otherUser:UserSocket = this.userService.findConnectedUserById(this.gameService.findOtherPlayer(user_send, data.mode));
				if (otherUser){
					let game = this.gameService.createGame([user_send, otherUser], data.mode)
					this.emitPopUp([user_send,otherUser], {error:false, message: `Game founded.`});
					this.server.to(game.id).emit("GAME_FOUND", {gameID:game.id, mode:data.mode})
					user_send.status = status.InGame
					otherUser.status = status.InGame
					game.pong.run()
					this.gameService.removeFromQueue([user_send.id, otherUser.id])
				}
			}
		} catch (e){
			console.log(e)
		}
	}

	@SubscribeMessage('QUIT_QUEUE')
	async quitQueue(@MessageBody() data: FIND_GAME_DATA) {
		try {
			const user_send:UserSocket = this.userService.findConnectedUserByUsername(data.client_send);
			if (user_send != undefined){
				this.gameService.removeFromQueue([user_send.id])
			}
		} catch (e){
			console.log(e)
		}
	}
	@SubscribeMessage('CHALLENGED')
	async challenged(@MessageBody() data: {action:string, mode:gamemode, asking:number, receiving:number, token:string}) {
		try {
			const user_asking:UserSocket = this.userService.findConnectedUserById(data.asking);
			const user_receiving:UserSocket = this.userService.findConnectedUserById(data.receiving);
			switch (data.action){
				case ("ASK"):{
					if (user_receiving != undefined && user_receiving.challenged === false){
						user_receiving.challenged = true;
						user_receiving.socket.emit("CHALLENGED", {who:{id:data.asking, username:user_asking.username}})
					}
					else
						this.emitPopUp([user_asking], {error:true, message: `User not connected.`});
					break;
				}
				case ("ACCEPT"):{
					this.gameService.removeFromQueue([user_asking.id, user_receiving.id])
					user_asking.socket.emit("CHALLENGED", {who:undefined})

					let game = this.gameService.createGame([user_asking, user_receiving], data.mode)
					this.emitPopUp([user_asking,user_receiving], {error:false, message: `Game founded.`});
					this.server.to(game.id).emit("GAME_FOUND", {gameID:game.id, mode:data.mode})
					user_asking.status = status.InGame
					user_receiving.status = status.InGame
					game.pong.run()
					break;
				}
				case ("DECLINE"):{
					user_asking.socket.emit("CHALLENGED", {who:undefined})
					this.emitPopUp([user_asking], {error:true, message: `Challenge declined.`});
					break;
				}
			}
		} catch (e){
			console.log(e)
		}
	}

	@SubscribeMessage('KEYPRESS')
	async keyPress(@MessageBody() data: {dir:string,id:number, on:boolean,gameID:string,jwt:string}) {
		this.gameService.findGame(data.gameID).pong.keyPress(data.id, data.dir == "ArrowUp" ? -1 : 1, data.on)
	}
	@SubscribeMessage('MOUSE_CLICK')
	async mouseclick(@MessageBody() data: {pos:{x:number, y:number},id:number,gameID:string,jwt:string}) {
		this.gameService.findGame(data.gameID).pong.mouseclick(data.id, data.pos)
	}

	@SubscribeMessage('SPECTATE')
	async spectate(@MessageBody() data:{clientId:number, spectateId:number, token:string}) {
		let gameId = this.gameService.spectate(data.clientId, data.spectateId)
		const user:UserSocket = this.userService.findConnectedUserById(data.clientId);
		if (user){
			user.status = status.Spectate
			user.socket.emit("JOIN_SPECTATE", {gameId})
		}
		
	}

	@SubscribeMessage('EDIT_USERNAME')
	async editUsername(@MessageBody() data:{id:number, newUsername:string, token:string}) {
		const userSocket:UserSocket = this.userService.findConnectedUserById(data.id);
		let ret = await this.userService.editUsername(data.id, data.newUsername)
		if (ret == 1) {
			this.emitPopUp([userSocket], {error:false, message: `Username successfuly changed.`});
			userSocket.socket.emit("UPDATE_DB", await this.userService.parseUserInfo(data.id))
		}
		else
			this.emitPopUp([userSocket], {error:true, message: `Username already exist.`});

	}
	@SubscribeMessage('EDIT_PROFILPIC')
	async editProfilPic(@MessageBody() data:{id:number, url:string, token:string}) {
		this.userService.changePic(data.id, data.url)
		const userSocket:UserSocket = this.userService.findConnectedUserById(data.id);
		this.emitPopUp([userSocket], {error:false, message: `Profil successfuly changed.`});
	}
}
