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
	friendRequest?:Array<number>;
}