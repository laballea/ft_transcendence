import { status } from "./user.entity";

export interface UserI {
	id:number;

	username:string;

	status:status;

	friends:number[]

	bloqued:number[]
}