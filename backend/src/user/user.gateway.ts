
import { Logger } from '@nestjs/common';
import { UserP } from './models/user.interface';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Repository, getConnection } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './models/user.entity';
import { status } from './models/user.entity';

@WebSocketGateway()
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
	constructor(
		@InjectRepository(UserEntity)
		private userRepository: Repository<UserEntity>
	){}

	private logger: Logger = new Logger("UserGateway");
	public connectedUser: UserP[] = [];

    @WebSocketServer()
    server: any;

	@SubscribeMessage('setID')
    async setID(@MessageBody() data: any) {
		let user = this.connectedUser.find((user: any) => {
			return user.socket.id === data.socketID
		})
		console.log("User", data.id, "connected");
		await getConnection()
			.createQueryBuilder()
			.update(UserEntity)
			.set({ status: status.Connected })
			.where("id = :id", { id: data.id })
			.execute();
		user.id = data.id
    }

    handleConnection(client: any) {
		this.connectedUser.push({
			id:undefined,
			socket: client
		})
		console.log("here")
        this.server.emit('loggin');
    }

    async handleDisconnect(client: any, ...args: any[]) {
		const user_idx = this.connectedUser.findIndex(v => v.socket.id === client.id)
		console.log("User", this.connectedUser[user_idx].id, "disconnected");
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

	async friendRequest(data:any){
		try {
			const user = this.connectedUser.find((user: any) => {
				return user.id === data.friendID
			})
			const db_user = await this.userRepository.findOne({ where:{id:user.id} }) // client receiving friend request
			console.log(db_user, db_user.friendsRequest)
			if (db_user.friendsRequest === null || !db_user.friendsRequest.includes(data.id)) { // does request already exist
				if (db_user.friendsRequest === null)
					db_user.friendsRequest = []
				db_user.friendsRequest.push(data.id); // if not add it
			}
			await getConnection() // update db
				.createQueryBuilder()
				.update(UserEntity)
				.set({ friendsRequest: db_user.friendsRequest })
				.where("id = :id", { id: db_user.id })
				.execute();
			user.socket.emit('friendRequest', db_user.friendsRequest) // emit to client new friend request list
		}
		catch (e){
			console.log(e);
		}
	}
}
