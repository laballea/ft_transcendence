import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	AfterLoad,
	AfterInsert,
	AfterUpdate,
	ManyToMany,
	JoinTable,
	OneToMany,
	ManyToOne
} from "typeorm";

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id:number;

	@Column({ nullable: true })
	public twoFactorAuthenticationSecret?: string;

	@Column({ default: false })
	public isTwoFactorAuthenticationEnabled: boolean;

	@Column()
	username:string;

	@Column("int", {nullable:true})
	intraID:number;

	@Column({ unique: true, nullable: true })
	public email: string;

	@Column({nullable:true})
	profilIntraUrl:string;

	@Column({nullable:true})
	profilPic:string;

	@Column("int", { array: true, default: '{}',nullable: true})
	friends: number[];

	@Column("int", { array: true, default: '{}',nullable: true })
	bloqued: number[];

	@Column("int", { array: true, default: '{}', nullable:true})
	friendsRequest: number[];

	@Column("int", { array: true, default: '{}', nullable:true})
	pendingRequest: number[];

	@ManyToMany(() => Room, room => room.users)
	rooms: Room[];

	@ManyToMany(() => Conversation, conversation => conversation.users)
	conversations: Conversation[];

	@ManyToMany(() => GameData, GameData => GameData.users)
	gameData: GameData[];

	@AfterLoad()
	@AfterInsert()
	@AfterUpdate()
	async nullChecks():Promise<void> {
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

@Entity()
export class Room {
	@PrimaryGeneratedColumn()
	id:number;

	@Column()
	name: string;

	@Column()
	password: string;

	@Column()
	ownerId: number;

	@Column("int", { array: true, default: '{}',nullable: true})
	adminId: number[];

	@Column("int", { array: true, default: '{}',nullable: true})
	bannedId: number[];

	@ManyToMany(() => User, user => user.rooms)
	@JoinTable()
	users: User[];

	@OneToMany(() => Message, message => message.room, {cascade: ['insert', 'update', 'remove']})
	messages: Message[];

	@OneToMany(() => Muted, muted => muted.room, {cascade: ['insert', 'update', 'remove']})
	muteds: Muted[];
}

@Entity()
export class Conversation {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@ManyToMany(() => User, user => user.conversations)
	@JoinTable()
	users: User[];

	@OneToMany(() => Message, message => message.conversation, {cascade: ['insert', 'update']})
	messages: Message[];
}

@Entity()
export class GameData {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToMany(() => User, user => user.gameData)
	@JoinTable()
	users: User[];

	@Column()
	winner: number;

	@Column()
	duration: number;

	@Column()
	maxSpeed: number;

	@Column("int", { array: true, default: '{}', nullable:true})
	score: number[];

	@Column()
	mode: string;
}

@Entity()
export class Message {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	idSend: number;

	@Column()
	author: string;

	@Column()
	content: string;

	@Column({nullable:true})
	date: string;

	@ManyToOne(() => Conversation, conversation => conversation.messages)
	conversation: Conversation;

	@ManyToOne(() => Room, room => room.messages)
	room: Room;
}

@Entity()
export class Muted {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	userId: number;

	@Column({nullable:true})
	date: string;

	@ManyToOne(() => Room, room => room.muteds)
	room: Room;
}
