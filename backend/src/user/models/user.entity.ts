import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

export enum status {
	Connected = 'Connected',
	Disconnected = 'Disconnected',
	InGame = 'InGame',
}

@Entity()
export class UserEntity {

	@PrimaryGeneratedColumn()
	id:number;

	@Column()
	username:string;

	@Column({default:status.Disconnected})
	status:status;

	@Column("int", { array: true,nullable: true})
	friends: number[];

	@Column("int", { array: true,nullable: true })
	bloqued: number[];

	@Column("int", { array: true, default: '{}', nullable:true})
	friendsRequest: number[];

}



