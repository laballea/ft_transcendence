import { status } from "./user.entity";
import { Conversation, Room } from "./user.entity";
import { Message } from "./user.entity";
export interface UserI {
	id:number;

	intraID:number;

	username:string;
	
	profilIntraUrl:string;

	friends:number[];

	bloqued:number[];

	conversations: Conversation[];

	rooms: Room[];

	friendsRequest:number[];
	nullChecks():Promise<void>;

}

export interface MessageI {
	id: number;
	idSend: number;
	idRecv: number;
	content: string;
	date: Date;
}

export interface RoomI {
	id: number;
	name: string;
	password: string;
	adminId: number;
	users: UserI[];
	messages: MessageI[];
}

export interface ConversationI {
	id: number;
	users: UserI[];
	messages: MessageI[];
}

export interface UserSocket {
	id: number;
	username:string;
	socket: any;
	status:status;
}

export interface UserSafeInfo {
	id:number;

	username:string;

	status?:status;

	friends?:{id:number, username:string}[];

	bloqued?:{id:number, username:string}[];

	friendsRequest?:{id:number, username:string}[];

	conv?:safeConv[];

	room?:safeRoom[];
}

export interface safeConv {
	id:number,
	msg:Message[],
	name:string,
	users:{id:number, username:string}[]
}

export interface safeRoom {
	id:number,
	name:string,
	password:string,
	adminId: number,
	msg:Message[],
	users:{id:number, username:string}[]
}
