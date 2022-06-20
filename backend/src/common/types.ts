import { Conversation, User } from "src/user/models/user.entity";
import { UserSocket } from "src/user/models/user.interface";
import { PongInstance } from "src/game/pongInstance"

export enum status {
	Connected = 'Connected',
	Disconnected = 'Disconnected',
	InGame = 'InGame',
	InQueue = 'InQueue',
}

export interface MessageEvent {
	data: string | object;
	id?: string;
	type?: string;
	retry?: number;
}

export interface friendEvent {
	id: number;
	friend_id: number;
}

export enum FRIEND_REQUEST_ACTIONS {
	ADD = 'ADD',
	REMOVE = 'REMOVE',
	DECLINE = 'DECLINE',
	ACCEPT = 'ACCEPT',
}

export interface FRIEND_REQUEST_DATA {
	client_send:string;
	client_recv:string;
	action:FRIEND_REQUEST_ACTIONS;
	jwt:number;
}

export enum HTTP_STATUS {
	ALREADY_EXIST = 'User already exist.',
	ALREADY_CONNECTED = 'User is already connected.',
	LOGIN_FAILED = 'Login failed.',
} 

export interface MESSAGE_DATA {
	client_send: string;
	client_recv: string;
	content: string;
	conversationID: number;
	jwt: number;
}

export interface FIND_GAME_DATA {
	client_send: string;
	jwt: number;
}

export interface POPUP_DATA {
	error:boolean,
	message:string,
}

export interface GameUserI {
	id:number,
	username:string,
	posx:number,
	posy:number,
	point:number,
	keyPress:number,
	speed:number
}

export enum GAME_STATUS {
	COUNTDOWN = 'COUNTDOWN',
	PAUSE = "PAUSE",
	RUNNING = "RUNNING",
	WINNER = "WINNER",
	ENDED = "ENDED"
}

export interface GameBallI {
	posx:number,
	posy:number,
	speed:number,
	d:{x:number, y:number}
	size:number // rayon
}

export interface GameI {
	users:GameUserI[],
	status:GAME_STATUS,
	ball:GameBallI,
	time:number,
	countDown:number,
	winner:string

}

export interface GAMES_SOCKET {
	id:string,
	usersID:number[],
	pong:PongInstance,
}