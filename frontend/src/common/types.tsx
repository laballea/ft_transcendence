export enum status {
	Connected = 'Connected',
	Disconnected = 'Disconnected',
	InGame = 'InGame',
}

export interface user {
	username?: string;
	status?: string;
	token?: string;
	logged?:boolean;
	friendsRequest?:Array<number>;
	friends?:Array<number>;
	clientChat:string;
	convID?:number;
	roomID?:number;
	conv?:Conv[];
	room?:Room[];
}

export enum FRIEND_REQUEST_ACTIONS {
	ADD = 'ADD',
	REMOVE = 'REMOVE',
	DECLINE = 'DECLINE',
	ACCEPT = 'ACCEPT',
}

export interface FRIEND_REQUEST_DATA {
	client_send:number;
	client_recv:number;
	action:FRIEND_REQUEST_ACTIONS;
	jwt:number;
}

export enum HTTP_STATUS {
	ALREADY_EXIST = 'ALREADY_EXIST',
	ALREADY_CONNECTED = 'ALREADY_CONNECTED',
	LOGIN_FAILED = 'LOGIN_FAILED',
}

export interface Message {
	content: string;
	date: string;
	id: number
	idRecv: number;
	idSend: number;
}

export interface Conv {
	id:number,
	msg:Message[],
	name:string,
	users:{id:number, username:string}[]
}

export interface Room {
	id: number,
	name: string,
	password: string,
	adminId: number,
	users:{id:number, username:string}[]
	msg: Message[],
}
