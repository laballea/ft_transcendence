import { UserP, UserSafeInfo } from './models/user.interface';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, ConnectedSocket } from '@nestjs/websockets';
import { Repository, getConnection } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './models/user.entity';
import { status } from './models/user.entity';
import { FRIEND_REQUEST_ACTIONS, FRIEND_REQUEST_DATA } from 'src/common/types';
import { UserService } from './user.service';
import { Inject } from '@nestjs/common';
import { truncateString } from 'src/common/utils';

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
		const user: UserEntity = await this.userRepository.findOne({ where:{username:username} }); // find user by his username
		
		return user.friends.map(id => ({ id: id, username: list.find(el => el.id == id).username, status:this.userService.getUserStatus(list.find(el => el.id == id).id)}));
	}

	emitPopUp(users:UserP[], error:boolean, message:string):void{
		for (let user of users) {
			user.socket.emit("PopUp", {message:message, error:error});
		}
	}
}
