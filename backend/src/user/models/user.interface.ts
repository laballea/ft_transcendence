import { status } from "src/common/types";
import { Conversation, GameData, Message, Muted, Room } from "./user.entity";

export interface UserI {
	id:number;

	twoFactorAuthenticationSecret?: string;

	isTwoFactorAuthenticationEnabled: boolean;

	username:string;

	intraID:number;

	email:string;

	profilIntraUrl:string;
	
	profilPic:string;

	friends:number[];

	bloqued:number[];

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

export interface MutedI {
	id: number;
	userId: number;
	date: string;
}

export interface RoomI {
	id: number;
	name: string;
	password: string;
	ownerId: number;
	adminId: number[];
	bannedId:number[];
	users: UserI[];
	messages: MessageI[];
	muteds: MutedI[];
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

	username:string;

	status?:status;

	friends?:{id:number, username:string}[];

	bloqued?:{id:number, username:string}[];

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
	ownerId:number,
	adminId:number[],
	bannedId:number[],
	msg:Message[],
	users:{id:number, username:string}[],
	muted:Muted[]
}
