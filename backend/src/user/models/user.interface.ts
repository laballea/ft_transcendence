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
	socket: any;
}