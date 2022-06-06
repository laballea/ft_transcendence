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
	client_emit:string;
	client_recv:string;
	action:FRIEND_REQUEST_ACTIONS;
	jwt:number;
}

export enum HTTP_STATUS {
	ALREADY_EXIST = 'User already exist.',
	ALREADY_CONNECTED = 'User is already connected.',
	LOGIN_FAILED = 'Login failed.',
} 