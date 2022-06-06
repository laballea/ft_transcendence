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
}

export enum FRIEND_REQUEST_ACTIONS {
	ADD = 'ADD',
	REMOVE = 'REMOVE',
	DECLINE = 'DECLINE',
	ACCEPT = 'ACCEPT',
}

export interface FRIEND_REQUEST_DATA {
	client_emit_id:number;
	client_recv_id:number;
	action:FRIEND_REQUEST_ACTIONS;
	jwt:number;
}

export enum HTTP_STATUS {
	ALREADY_EXIST = 'ALREADY_EXIST',
	ALREADY_CONNECTED = 'ALREADY_CONNECTED',
	LOGIN_FAILED = 'LOGIN_FAILED',
} 