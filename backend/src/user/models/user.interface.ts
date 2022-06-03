import { status } from "./user.entity";

export interface UserI {
	id:number;

	username:string;

	status:status;

	friends:number[];

	bloqued:number[];

	friendsRequest:number[];
}

export interface UserP {
	id: number;
	username:string;
	socket: any;
}

export interface UserSafeInfo {
	id:number;

	username:string;

	status?:status;

	friends?:{id:number, username:string}[];

	bloqued?:{id:number, username:string}[];

	friendsRequest?:{id:number, username:string}[];
}