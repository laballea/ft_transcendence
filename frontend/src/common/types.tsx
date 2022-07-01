export enum status {
	Connected = 'Connected',
	Disconnected = 'Disconnected',
	InGame = 'InGame',
	InQueue = 'InQueue',
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
	conv?:Conv[];
	gameID?:string
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

export interface GameUserI {
	id:number,
	username:string,
	posx:number,
	posy:number,
	point:number,
	you:boolean
}

export interface GameI {
	users:GameUserI[],
	ball:{
		posx:number,
		posy:number
	},
	status:GAME_STATUS,
	time:number,
	countDown:number,
	winner:string
}

export enum GAME_STATUS {
	COUNTDOWN = 'COUNTDOWN',
	PAUSE = "PAUSE",
	RUNNING = "RUNNING",
	WINNER = "WINNER",
	ENDED = "ENDED"
}