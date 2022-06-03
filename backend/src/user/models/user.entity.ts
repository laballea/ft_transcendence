import { Entity, Column, PrimaryGeneratedColumn, AfterLoad, AfterInsert, AfterUpdate } from "typeorm";

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

	@Column("int", { array: true, default: '{}',nullable: true})
	friends: number[];

	@Column("int", { array: true, default: '{}',nullable: true })
	bloqued: number[];

	@Column("int", { array: true, default: '{}', nullable:true})
	friendsRequest: number[];


	@AfterLoad()
	@AfterInsert()
	@AfterUpdate()
	async nullChecks() {
	  if (!this.friendsRequest) {
		this.friendsRequest = []
	  }
	  if (!this.friends) {
		this.friends = []
	  }
	  if (!this.bloqued) {
		this.bloqued = []
	  }
	}
}



