import { status } from "./user.entity";

export interface UserI {
	id:number;

	intraID:number;

	username:string;
	
	profilIntraUrl:string;

	friends:number[];

	bloqued:number[];

	friendsRequest:number[];
	nullChecks():Promise<void>;
}

export interface UserP {
	id: number;
	username:string;
	socket: any;
	status:status;
}

export interface UserSafeInfo {
	id:number;

	username:string;

	status?:status;

	friends?:{id:number, username:string}[];

	bloqued?:{id:number, username:string}[];

	friendsRequest?:{id:number, username:string}[];
}