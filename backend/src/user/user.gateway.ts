import { UserP, UserSafeInfo } from './models/user.interface';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, ConnectedSocket } from '@nestjs/websockets';
import { Repository, getConnection } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './models/user.entity';
import { status } from './models/user.entity';
import { FRIEND_REQUEST_ACTIONS, FRIEND_REQUEST_DATA } from 'src/common/types';
import { UserService } from './user.service';
import { Inject } from '@nestjs/common';
@WebSocketGateway({
	cors: {
		origin: '*',
	},
})

@WebSocketGateway()
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
	constructor(
		@InjectRepository(UserEntity)
		private userRepository: Repository<UserEntity>,
		
		@Inject(UserService)
		private userService: UserService,
	){}

	public connectedUser: UserP[] = [];

	@WebSocketServer()
	server: any;

	handleConnection(client: any) {
		if (!this.server) this.server = client.server;
	};
	afterInit(server: any) {}

	async handleDisconnect(client: any, ...args: any[]) {
		const user_idx = this.connectedUser.findIndex(v => v.socket.id === client.id)
		if (this.connectedUser[user_idx]) {
			console.log(this.connectedUser[user_idx].username, "disconnected");
			this.connectedUser.splice(user_idx, 1);
		}
	}

	getStatus(id:number):status{
		const user = this.connectedUser.find((user: any) => {return user.id === id})
		if (user)
			return user.status;
		else
			return status.Disconnected;
	}

	@SubscribeMessage('CONNECT')
	async connect(@MessageBody() data: {socketID:string, id:number, username:string}, @ConnectedSocket() client: any) {
		console.log("WHY BOTH")
		const user = this.connectedUser.find((user: any) => {return user.id === data.id})
		if (!user){
			this.connectedUser.push({
				id:data.id,
				username:data.username,
				socket: client,
				status:status.Connected,
			})
		}
		console.log("sockets map", this.server.sockets.sockets)
		console.log("server", this.server.sockets.server)
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
				.update(UserEntity)
				.set(db_user_recv)
				.where("id = :id", { id: db_user_recv.id })
				.execute();
			await getConnection()
				.createQueryBuilder()
				.update(UserEntity)
				.set(db_user_emit)
				.where("id = :id", { id: db_user_emit.id })
				.execute();
			if (user_recv)
				user_recv.socket.emit('UPDATE_DB', await this.parseUserInfo(db_user_recv))
			if (user_emit)
				user_emit.socket.emit('UPDATE_DB', await this.parseUserInfo(db_user_emit))
		}
		catch (e){
			console.log(e);
		}
	}
	async parseUserInfo(userInfo:UserEntity):Promise<UserSafeInfo> {
		const userRepo = await this.userRepository.find()
		var UserSafeInfo:UserSafeInfo = {
			id: userInfo.id,
			username: userInfo.username,
			status:this.getStatus(userInfo.id),
		};
		UserSafeInfo.friends = userInfo.friends.map(id => ({ id: id, username: userRepo.find(el => el.id == id).username}));
		UserSafeInfo.bloqued = userInfo.bloqued.map(id => ({ id: id, username: userRepo.find(el => el.id == id).username}));
		UserSafeInfo.friendsRequest = userInfo.friendsRequest.map(id => ({ id: id, username: userRepo.find(el => el.id == id).username}));
		return UserSafeInfo;
	}
	async getContactList(username: string):Promise<{ id: number; username: string; }[]>{
		const list = await this.userRepository.find();
		const user: UserEntity = await this.userRepository.findOne({ where:{username:username} });
		return user.friends.map(id => ({ id: id, username: list.find(el => el.id == id).username, status:this.getStatus(list.find(el => el.id == id).id)}));
	}
}
