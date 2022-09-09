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
import { Inject} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation, Message, User, Room, Muted } from './models/user.entity';
import { gamemode, status } from 'src/common/types';
import { 
	FRIEND_REQUEST_ACTIONS,
	FRIEND_REQUEST_DATA,
	MESSAGE_DATA,
	POPUP_DATA,
	ROOM_DATA,
	NEW_MEMBER,
	FIND_GAME_DATA,
	ROOM_NEW_PASS,
	BLOCKED_DATA
} from 'src/common/types';
import { UserService } from './user.service';
import { truncateString } from 'src/common/utils';
import { Server } from 'socket.io';
import { FriendsService } from 'src/friends/friends.service';
import { GameService } from 'src/game/game.service';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';

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
		@Inject(AuthService)
		private authService: AuthService,
		
		@InjectRepository(Muted)
		private mutedRepository: Repository<Muted>,

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
	async connect(@MessageBody() data: {socketID:string, id:number, username:string, jwt:string}, @ConnectedSocket() client: any) {
		try {
			await this.authService.validToken(data.jwt)
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
		catch (e){}
	}

	@SubscribeMessage('FRIEND_REQUEST')
	async addFriend(@MessageBody() data: FRIEND_REQUEST_DATA) {
		try {
			await this.authService.validToken(data.jwt)
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
		catch (e){}
	}
	@SubscribeMessage('BLOCKED')
	async blocked(@MessageBody() data: BLOCKED_DATA) {
		try {
			await this.authService.validToken(data.jwt)
			/* Find if clients are connected*/
			const user:UserSocket = this.userService.findConnectedUserByUsername(data.user);
			const user_to_block:UserSocket = this.userService.findConnectedUserByUsername(data.user_to_block);

			/* find user in db */
			const db_user = await this.userRepository.findOne({ where:{username:data.user} })
			const db_user_to_block = await this.userRepository.findOne({ where:{username:data.user_to_block} })

			if (user){
				if (db_user.blocked.includes(user_to_block.id)){
					db_user.blocked.splice(db_user.blocked.indexOf(user_to_block.id), 1);
				} else {
					this.friendsService.remove(db_user, db_user_to_block)
					db_user.blocked.push(db_user_to_block.id)
				}
			}
			/* update both user db */
			await this.userService.updateUserDB([db_user, db_user_to_block]);
			if (user)
				user.socket.emit('UPDATE_DB', await this.userService.parseUserInfo(db_user.id))
			if (user_to_block)
				user_to_block.socket.emit('UPDATE_DB', await this.userService.parseUserInfo(db_user_to_block.id))
		}
		catch (e){}
	}
	/*
		return array of object with id, username and status
	*/
	async getContactList(username: string):Promise<{ id: number; username: string; }[]>{
		const list = await this.userRepository.find(); // retrieve all users in db
		const user: User = await this.userRepository.findOne({ where:{username:username} }); // find user by his username
		
		return user.friends.map(id => ({ id: id, username: list.find(el => el.id == id).username, profilPic: list.find(el => el.id == id).profilPic, status:this.userService.getUserStatus(list.find(el => el.id == id).id)}));
	}

	emitPopUp(users:UserSocket[], data:POPUP_DATA):void{
		for (let user of users) {
			user.socket.emit("PopUp", {message:data.message, error:data.error});
		}
	}

	@SubscribeMessage('dmServer')
	async handleDM(@MessageBody() data: MESSAGE_DATA) {
		try {
			await this.authService.validToken(data.jwt)
			const user_send:UserSocket = this.userService.findConnectedUserByUsername(data.client_send);
			const db_user_send:User = await this.userRepository.findOne({ where:{username:data.client_send} })
			
			if (data.client_recv == undefined && (!data.conversationID || data.conversationID < 0))
				return this.emitPopUp([user_send], {error:true, message: `Message can't be sent.`});
	
			/* does conversation exist else create it */
			let conv : Conversation = await this.convRepository.findOne({
				relations:["users"],
				where: {
					id: data.conversationID
				},
			})
		
			let db_user_recv:User = await this.userRepository.findOne({ where:{username:data.client_recv} })
			db_user_recv = db_user_recv == undefined ? conv.users.find((user:any)=> user.id != user_send.id): db_user_recv
			if (db_user_recv.blocked.includes(db_user_send.id))
				return this.emitPopUp([user_send], {error:true, message: `User blocked you.`});
			if (db_user_send.blocked.includes(db_user_recv.id))
				return this.emitPopUp([user_send], {error:true, message: `User is blocked.`});
	
			if (!conv && data.client_recv != undefined){
				conv = new Conversation();
				conv.users = [db_user_send, db_user_recv];
				conv.name = db_user_recv.username
				await this.convRepository.save(conv);
			} else if (!conv && data.client_recv == undefined)
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
		catch(e){}
	}

	@SubscribeMessage('newChatRoom')
	async handleRoom(@MessageBody() data: ROOM_DATA) {
		try {
			await this.authService.validToken(data.jwt)
			const user_send: UserSocket = this.userService.findConnectedUserByUsername(data.admin);
			const db_user_send: User = await this.userRepository.findOne({ where:{username:data.admin} })
			/* does Room exist else create it */
			let room : Room = await this.roomRepository.findOne({ where:{name: data.name} })
			if (!room) {
				room = new Room();
				room.name = data.name;
				room.password = await bcrypt.hash(data.password, 10);
				room.ownerId = db_user_send.id;
				room.adminId = [db_user_send.id];
				room.users = [db_user_send];
				await this.roomRepository.save(room);
				user_send.socket.emit('UPDATE_DB', await this.userService.parseUserInfo(db_user_send.id))
			}
			else {
				return this.emitPopUp([user_send], {error:true, message: `Room name ${data.name} already exist.`});
			}
		}
		catch(e){}
	}

	@SubscribeMessage('changePassRoom')
	async changePassRoom(@MessageBody() data: ROOM_NEW_PASS) {
		try {
			await this.authService.validToken(data.jwt)
			const admin: UserSocket = this.userService.findConnectedUserByUsername(data.admin);
			let room : Room = await this.roomRepository.findOne({ where:{id: data.roomId} })
			if (!room)
				return this.emitPopUp([admin], {error:true, message: `Room doesn't exist.`});
			else if (room.adminId.find((e:number) => e === admin.id) !== admin.id)
				return this.emitPopUp([admin], {error:true, message: `Permission required !`});
			else {
				if (await bcrypt.compare(data.oldPass, room.password) === false)
					return this.emitPopUp([admin], {error:true, message: `Password doesn't match with the room !`});
				room.password = await bcrypt.hash(data.newPass, 10);
				await this.roomRepository.save(room);
				for (let idx in room.users){
					let userSocket = this.userService.findConnectedUserByUsername(room.users[idx].username)
					if (userSocket)
						userSocket.socket.emit('UPDATE_DB', await this.userService.parseUserInfo(room.users[idx].id))
				}
			}
		}
		catch(e){}
	}

	@SubscribeMessage('deleteRoom')
	async deleteRoom(@MessageBody() data: {roomId: number, user: string, jwt:string}) {
		try {
			await this.authService.validToken(data.jwt)
			const user: UserSocket = this.userService.findConnectedUserByUsername(data.user);
			const db_user: User = await this.userRepository.findOne({ where:{username:data.user} })
			let room : Room = await this.roomRepository.findOne({
				where:{id: data.roomId},
				relations:['users', 'users.rooms'],
			})
			if (!room)
				return this.emitPopUp([user], {error:true, message: `Room doesn't exist.`});
			if (db_user.id !== room.ownerId)
				return this.emitPopUp([user], {error:true, message: `You aren't the Owner of this room !`});
			//delete msg then delete room
			await this.messageRepository
			.createQueryBuilder()
			.delete()
			.from(Message)
			.where("roomId = :roomId", { roomId: data.roomId })
			.execute();
			//delete muted then delete room
			await this.mutedRepository
			.createQueryBuilder()
			.delete()
			.from(Muted)
			.where("roomId = :roomId", { roomId: data.roomId })
			.execute();
			//delete room empty
			await this.roomRepository
			.createQueryBuilder()
			.delete()
			.from(Room)
			.where("id = :id", { id: data.roomId })
			.andWhere("ownerId = :ownerId", {ownerId: db_user.id})
			.execute();
			for (let idx in room.users){
				let userSocket = this.userService.findConnectedUserByUsername(room.users[idx].username)
				let res = await this.userService.parseUserInfo(room.users[idx].id)
				if (userSocket)
					userSocket.socket.emit('UPDATE_DB',res )
			}
		}
		catch(e){}
	}

	@SubscribeMessage('joinRoom')
	async joinRoom(@MessageBody() data: {joinRoom:string, passRoom:string, user:string, jwt:string}) {
		try {
			await this.authService.validToken(data.jwt)
			const user: UserSocket = this.userService.findConnectedUserByUsername(data.user);
			const newUser: User = await this.userRepository.findOne({ where:{username:data.user} })
			let room : Room = await this.roomRepository.findOne({
				where:{name: data.joinRoom},
				relations:['users', 'users.rooms'],
			})
			if (!room)
				return this.emitPopUp([user], {error:true, message: `Room doesn't exist !`});
			else if (await bcrypt.compare(data.passRoom, room.password) === false)
				return this.emitPopUp([user], {error:true, message: `Password doesn't match with the room !`});
			else if (room.bannedId.find((e:number) => e === newUser.id) === newUser.id)
				return this.emitPopUp([user], {error:true, message: `You are banned of this room !`});
			room.users.push(newUser)
			await this.roomRepository.save(room);
			for (let idx in room.users){
				let userSocket = this.userService.findConnectedUserByUsername(room.users[idx].username)
				if (userSocket)
					userSocket.socket.emit('UPDATE_DB', await this.userService.parseUserInfo(room.users[idx].id))
			}
		}
		catch(e){}
	}

	@SubscribeMessage('deleteMember')
	async deleteMember(@MessageBody() data: {roomId: number, userId: number, admin: string, jwt:string}) {
		try {
			await this.authService.validToken(data.jwt)
			const user: UserSocket = this.userService.findConnectedUserByUsername(data.admin);
			let room : Room = await this.roomRepository.findOne({
				where:{id: data.roomId},
				relations:['users', 'users.rooms'],
			})
			const db_admin: User = await this.userRepository.findOne({ where:{username:data.admin} })
			if (!room)
				return this.emitPopUp([user], {error:true, message: `Room doesn't exist !`});
			else if (room.adminId.find((e:number) => e === db_admin.id) !== db_admin.id)
				return this.emitPopUp([user], {error:true, message: `Permission required !`});
			if (data.userId == db_admin.id)
				this.deleteRoom({roomId: data.roomId, user: data.admin, jwt:data.jwt})
			else {
				await this.roomRepository
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
		catch(e){}
	}


	@SubscribeMessage('banMember')
	async banMember(@MessageBody() data: {roomId: number, userId: number, admin: string, jwt:string}) {
		try {
			await this.authService.validToken(data.jwt)
			const admin: UserSocket = this.userService.findConnectedUserByUsername(data.admin);
			let room : Room = await this.roomRepository.findOne({
				where:{id: data.roomId},
				relations:['users', 'users.rooms'],
			})
			if (!room)
				return this.emitPopUp([admin], {error:true, message: `Room doesn't exist.`});
			else {
				//ban userId admin
				room.bannedId.push(data.userId);
				await this.roomRepository.save(room);
				this.deleteMember({roomId: data.roomId, userId: data.userId, admin: data.admin, jwt:data.jwt});
			}
		}
		catch(e){}
	}

	@SubscribeMessage('muteMember')
	async muteMember(@MessageBody() data: {roomId: number, userId: number, admin: string, jwt:string}) {
		try {
			await this.authService.validToken(data.jwt)
			const admin: UserSocket = this.userService.findConnectedUserByUsername(data.admin);
			let room : Room = await this.roomRepository.findOne({
				relations:['users','users.rooms'],
				where:{id: data.roomId},
			})
			if (!room)
				return this.emitPopUp([admin], {error:true, message: `Room doesn't exist.`});
			else if (room.adminId.find((e:number) => e === admin.id) !== admin.id)
				return this.emitPopUp([admin], {error:true, message: `Permission required !`});
			// check already muted
			let mutedList : Room = await this.roomRepository.findOne({
				relations:['muteds'],
				where:{id: data.roomId},
			})
			for (let idx in mutedList.muteds)
				if (mutedList.muteds[idx].userId === data.userId)
					return this.emitPopUp([admin], {error:true, message: `He's already muted !`});
			//mute userId admin
			let muted = new Muted();
			muted.userId = data.userId;
			muted.date = new Date(new Date().getTime()+10000).toUTCString()
			muted.room = room;
			await this.mutedRepository.save(muted);
			await this.roomRepository.save(room);
			for (let idx in room.users) {
				let userSocket = this.userService.findConnectedUserByUsername(room.users[idx].username)
				if (userSocket)
					userSocket.socket.emit('UPDATE_DB', await this.userService.parseUserInfo(room.users[idx].id))
			}
		}
		catch(e){}
	}

	@SubscribeMessage('unmuteMember')
	async unmuteMember(@MessageBody() data: {roomId: number, userId: number, admin: string, jwt:string}) {
		try {
			await this.authService.validToken(data.jwt)
			const admin: UserSocket = this.userService.findConnectedUserByUsername(data.admin);
			let room : Room = await this.roomRepository.findOne({
				where:{id: data.roomId},
				relations:['users', 'users.rooms', 'muteds', 'muteds.room'],
			})
			if (!room)
				return this.emitPopUp([admin], {error:true, message: `Room doesn't exist.`});
			else if (room.adminId.find((e:number) => e === admin.id) !== admin.id)
				return this.emitPopUp([admin], {error:true, message: `Permission required !`});
			//unmute userId admin
			await this.mutedRepository
			.createQueryBuilder()
			.delete()
			.from(Muted)
			.where("userId = :userId", {userId: data.userId})
			.andWhere("roomId = :roomId", {roomId: data.roomId})
			.execute();
			for (let idx in room.users){
				let userSocket = this.userService.findConnectedUserByUsername(room.users[idx].username)
				if (userSocket)
					userSocket.socket.emit('UPDATE_DB', await this.userService.parseUserInfo(room.users[idx].id))
			}
		}
		catch(e){}
	}

	@SubscribeMessage('upgradeMember')
	async upgradeMember(@MessageBody() data: {roomId: number, userId: number, admin: string, jwt:string}) {
		try {
			await this.authService.validToken(data.jwt)
			const admin: UserSocket = this.userService.findConnectedUserByUsername(data.admin);
			let room : Room = await this.roomRepository.findOne({
				where:{id: data.roomId},
				relations:['users', 'users.rooms'],
			})
			if (!room)
				return this.emitPopUp([admin], {error:true, message: `Room doesn't exist.`});
			if (admin.id !== room.ownerId)
				return this.emitPopUp([admin], {error:true, message: `You aren't the Owner of this room !`});
			else {
				//add userId admin
					// check already muted
				let mutedList : Room = await this.roomRepository.findOne({
					relations:['muteds'],
					where:{id: data.roomId},
				})
				for (let idx in mutedList.muteds)
					if (mutedList.muteds[idx].userId === data.userId)
						this.unmuteMember({roomId: data.roomId, userId: data.userId, admin: data.admin, jwt:data.jwt});
				room.adminId.push(data.userId);
				await this.roomRepository.save(room);
				for (let idx in room.users) {
					let userSocket = this.userService.findConnectedUserByUsername(room.users[idx].username)
					if (userSocket)
						userSocket.socket.emit('UPDATE_DB', await this.userService.parseUserInfo(room.users[idx].id))
				}
			}
		}
		catch(e){}
	}

	@SubscribeMessage('downgradeMember')
	async downgradeMember(@MessageBody() data: {roomId: number, userId: number, admin: string, jwt:string}) {
		try {
			await this.authService.validToken(data.jwt)
			const admin: UserSocket = this.userService.findConnectedUserByUsername(data.admin);
			let room : Room = await this.roomRepository.findOne({
				where:{id: data.roomId},
				relations:['users', 'users.rooms'],
			})
			if (!room)
				return this.emitPopUp([admin], {error:true, message: `Room doesn't exist.`});
			if (admin.id !== room.ownerId)
				return this.emitPopUp([admin], {error:true, message: `You aren't the Owner of this room !`});
			else {
				//remove userId admin
				for(var i = 0; i < room.adminId.length; i++)
					if ( room.adminId[i] === data.userId)
						room.adminId.splice(i, 1);
				await this.roomRepository.save(room);
				for (let idx in room.users){
					let userSocket = this.userService.findConnectedUserByUsername(room.users[idx].username)
					if (userSocket)
						userSocket.socket.emit('UPDATE_DB', await this.userService.parseUserInfo(room.users[idx].id))
				}
			}
		}
		catch(e){}
	}

	@SubscribeMessage('roomMsg')
	async handleRoomMsg(@MessageBody() data: MESSAGE_DATA) {
		try {
			await this.authService.validToken(data.jwt)
			const user_send: UserSocket = this.userService.findConnectedUserByUsername(data.client_send);
			const db_user_send:User = await this.userRepository.findOne({ where:{username:data.client_send} })

			/* does conversation exist else create it */
			let room : Room = await this.roomRepository.findOne({
				relations:['users', 'users.rooms', 'muteds', 'muteds.room'],
				where: {
					id: data.conversationID
				},
			})

			let timeExpire = false;
			for (let idx in room.muteds) {
				if (room.muteds[idx].userId === db_user_send.id) {
					let dateDB = new Date(room.muteds[idx].date);
					let dateNow = new Date();
					if (dateDB < dateNow)
						timeExpire = true;
					else
						return this.emitPopUp([user_send], {error:true, message: `You are muted until ${(dateDB.getTime() - dateNow.getTime())/1000} !`});
				}
			}

			/* create new message, save it, update room */
			let msg = new Message();
			msg.content = data.content;
			msg.date = new Date().toUTCString();
			msg.idSend = db_user_send.id;
			msg.author = db_user_send.username;
			msg.room = room;
			await this.messageRepository.save(msg);
			await this.roomRepository.save(room);
			if (timeExpire) {
				await this.mutedRepository
				.createQueryBuilder()
				.delete()
				.from(Muted)
				.where("userId = :userId", {userId: db_user_send.id})
				.andWhere("roomId = :roomId", {roomId: data.conversationID})
				.execute();
			}
			for (let idx in room.users){
				let userSocket = this.userService.findConnectedUserByUsername(room.users[idx].username)
				if (userSocket)
					userSocket.socket.emit('UPDATE_DB', await this.userService.parseUserInfo(room.users[idx].id))
			}
		}
		catch(e){}
	}

	/*
		add user to queue
		try to find another user
		create & launch game if finded
	*/
	@SubscribeMessage('FIND_GAME')
	async findGame(@MessageBody() data: FIND_GAME_DATA) {
		try {
			await this.authService.validToken(data.jwt)
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
		} catch (e){}
	}

	@SubscribeMessage('QUIT_QUEUE')
	async quitQueue(@MessageBody() data: FIND_GAME_DATA) {
		try {
			await this.authService.validToken(data.jwt)
			const user_send:UserSocket = this.userService.findConnectedUserByUsername(data.client_send);
			if (user_send != undefined){
				this.gameService.removeFromQueue([user_send.id])
			}
		} catch (e){}
	}

	@SubscribeMessage('SPECTATE')
	async spectate(@MessageBody() data:{clientId:number, spectateId:number, jwt:string}) {
		try {
			await this.authService.validToken(data.jwt)
			let gameId = this.gameService.spectate(data.clientId, data.spectateId)
			const user:UserSocket = this.userService.findConnectedUserById(data.clientId);
			if (user){
				user.status = status.Spectate
				user.socket.emit("JOIN_SPECTATE", {gameId})
			}
		} catch (e){}
	}

	@SubscribeMessage('QUIT_GAME')
	async quitGame(@MessageBody() data: {client_send: string, gameID:string, jwt: string}) {
		try {
			await this.authService.validToken(data.jwt)
			const user_send:UserSocket = this.userService.findConnectedUserByUsername(data.client_send);
			if (user_send != undefined){
				this.gameService.quitGame(data.gameID, user_send)
			}
		} catch (e){}
	}

	@SubscribeMessage('CHALLENGED')
	async challenged(@MessageBody() data: {action:string, mode:gamemode, asking:number, receiving:number, jwt:string}) {
		try {
			await this.authService.validToken(data.jwt)
			const user_asking:UserSocket = this.userService.findConnectedUserById(data.asking);
			const user_receiving:UserSocket = this.userService.findConnectedUserById(data.receiving);
			switch (data.action){
				case ("ASK"):{
					if (user_receiving == undefined)
						this.emitPopUp([user_asking], {error:true, message: `User not connected.`});
					else{
						user_receiving.socket.emit("CHALLENGED", {who:{id:data.asking, username:user_asking.username}})
					}
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
		} catch (e){}
	}

	@SubscribeMessage('KEYPRESS')
	async keyPress(@MessageBody() data: {dir:string,id:number, on:boolean,gameID:string,jwt:string}) {
		try {
			await this.authService.validToken(data.jwt)
			this.gameService.findGame(data.gameID).pong.keyPress(data.id, data.dir == "ArrowUp" ? -1 : 1, data.on)
		} catch (e){}
	}
	@SubscribeMessage('MOUSE_CLICK')
	async mouseclick(@MessageBody() data: {pos:{x:number, y:number},id:number,gameID:string,jwt:string}) {
		try {
			await this.authService.validToken(data.jwt)
			this.gameService.findGame(data.gameID).pong.mouseclick(data.id, data.pos)
		} catch (e){}
	}

	@SubscribeMessage('EDIT_USERNAME')
	async editUsername(@MessageBody() data:{id:number, newUsername:string, jwt:string}) {
		try {
			await this.authService.validToken(data.jwt)
			const userSocket:UserSocket = this.userService.findConnectedUserById(data.id);
			let ret = await this.userService.editUsername(data.id, data.newUsername)
			if (ret == 1) {
				this.emitPopUp([userSocket], {error:false, message: `Username successfuly changed.`});
				userSocket.socket.emit("UPDATE_DB", await this.userService.parseUserInfo(data.id))
			}
			else
				this.emitPopUp([userSocket], {error:true, message: `Username already exist.`});
		} catch (e){}
	}
	@SubscribeMessage('EDIT_PROFILPIC')
	async editProfilPic(@MessageBody() data:{id:number, url:string, jwt:string}) {
		try {
			await this.authService.validToken(data.jwt)
			this.userService.changePic(data.id, data.url)
			const userSocket:UserSocket = this.userService.findConnectedUserById(data.id);
			this.emitPopUp([userSocket], {error:false, message: `Profil successfuly changed.`});
		} catch (e){}
	}
}
