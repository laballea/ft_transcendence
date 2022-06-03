
import { Logger } from '@nestjs/common';
import { UserP } from './models/user.interface';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, ConnectedSocket } from '@nestjs/websockets';
import { Repository, getConnection } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './models/user.entity';
import { status } from './models/user.entity';
import { FRIEND_REQUEST_ACTIONS, FRIEND_REQUEST_DATA } from 'src/common/types';
import { UserService } from './user.service';
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
		private userService:UserService
	){}

	private logger: Logger = new Logger("UserGateway");
	public connectedUser: UserP[] = [];

	@WebSocketServer()
	server: any;

	handleConnection(client: any) {
	}

	async handleDisconnect(client: any, ...args: any[]) {
		const user_idx = this.connectedUser.findIndex(v => v.socket.id === client.id)
		console.log(this.connectedUser[user_idx].username, "disconnected");
		await getConnection()
			.createQueryBuilder()
			.update(UserEntity)
			.set({ status: status.Disconnected })
			.where("id = :id", { id: this.connectedUser[user_idx].id })
			.execute();
		this.connectedUser.splice(user_idx, 1);
	}

	afterInit(server: any) {
		console.log('Socket is live')
		this.logger.log("Socket is live")
	}

	@SubscribeMessage('CONNECT')
	async connect(@MessageBody() data: {socketID:string, id:number, username:string}, @ConnectedSocket() client: any) {
		this.connectedUser.push({
			id:data.id,
			username:data.username,
			socket: client
		})
		await getConnection()
			.createQueryBuilder()
			.update(UserEntity)
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
				user_recv.socket.emit('UPDATE_DB', await this.userService.parseUserInfo(db_user_recv))
			if (user_emit)
				user_emit.socket.emit('UPDATE_DB', await this.userService.parseUserInfo(db_user_emit))
		}
		catch (e){
			console.log(e);
		}
	}

}
