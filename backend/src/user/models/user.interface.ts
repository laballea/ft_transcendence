import { status } from "src/common/types";
import { Conversation, GameData, Message, Room } from "./user.entity";

export interface UserI {
	id:number;

	twoFactorAuthenticationSecret?: string;

	isTwoFactorAuthenticationEnabled: boolean;

	username:string;

	intraID:number;

	lvl:number;

	email:string;

	profilIntraUrl:string;
	
	profilPic:string;

	friends:number[];

	blocked:number[];

	conversations: Conversation[];

	rooms: Room[];

	gameData: GameData[];

	friendsRequest:number[];

	pendingRequest:number[];
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
	gameID?:string,
	socket: any;
	status:status;
	challenged:boolean;
}

export interface UserSafeInfo {
	id:number;

	lvl:number;

	username:string;

	status?:status;

	friends?:{id:number, username:string}[];

	blocked?:{id:number, username:string}[];

	friendsRequest?:{id:number, username:string}[];

	pendingRequest?:{id:number, username:string}[];

	conv?:safeConv[];

	room?:safeRoom[];
	
	profilPic:string;

	gameID:string;

	twoFactor:boolean;
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
