
import { Logger, Body } from '@nestjs/common';
import { UserP } from './models/user.interface';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';

@WebSocketGateway()
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {

	private logger: Logger = new Logger("UserGateway");
	public connectedUser: UserP[];

    @WebSocketServer()
    server: any;

    @SubscribeMessage('loggin')
    handleEvent(@MessageBody() data: string) {
        this.server.emit('loggin', data);
    }

    handleConnection(client: any, ...args: any[]) {
		console.log(args)
		/*this.connectedUser.push({
			username: args[0],
			socket: client
		})*/
        console.log(this.connectedUser);
		client.emit("loggin", "Your connected bro")
    }

    handleDisconnect(client: any, ...args: any[]) {
        console.log('User disconnected');
		//this.connectedUser.splice(this.connectedUser.findIndex(v => v.username === args[0]), 1);
		//console.log(this.connectedUser)
    }

    afterInit(server: any) {
        console.log('Socket is live')
		this.logger.log("Socket is live")
    }
}

