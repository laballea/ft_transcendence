import { Injectable, Inject } from '@nestjs/common';
import { GameI, gamemode, GAMES_SOCKET, GAME_STATUS, status } from 'src/common/types';
import { User } from 'src/user/models/user.entity';
import { UserSocket } from 'src/user/models/user.interface';
import { UserService } from 'src/user/user.service';
import { Pong } from './pong';
import { Boost } from './mode/pongBoost';
import { Normal } from './mode/pongNormal';
import { Queue } from './Queue';

let s4 = () => {
	return Math.floor((1 + Math.random()) * 0x10000)
		.toString(16)
		.substring(1);
  }

@Injectable()
export class GameService {
	constructor(
		private userService:UserService,
	){
		this.Queue = new Queue()
		this.mode = new Map()
		this.mode[gamemode.normal] = Normal
		this.mode[gamemode.boost] = Boost
	}
	public Games: GAMES_SOCKET[] = [];
	public Queue: Queue
	private mode: Map<gamemode, Pong>

	addToQueue(user:UserSocket, mode:gamemode):boolean{
		return this.Queue.addToQueue(user, mode)
	}
	removeFromQueue(userID:number[]){
		this.Queue.removeFromQueue(userID)
	}
	removeGame(gameID:string):boolean{
		if (this.Games.find((game)=>game.id==gameID)){
			this.Games.splice(this.Games.findIndex((game)=>game.id==gameID), 1)
			return true
		}
		return false
	}

	findOtherPlayer(user:UserSocket, mode:gamemode):number{
		return (this.Queue.findOtherPlayer(user, mode))
	}

	findGame(id:string):GAMES_SOCKET{
		let res = this.Games.find(game => {return game.id == id})
		return res
	}
	spectate(userID:number, spectateID:number):string{
		let game = this.Games.find((game)=>game.usersID.includes(spectateID))
		if (game){
			game.spectatesID.push(userID)
			return game.id
		}
		else
			return undefined
	}

	reconnect(userID:number):string{
		let game = this.Games.find((game)=>game.usersID.includes(userID))
		if (game){
			if (this.userService.getUserStatus(game.usersID[0]) != status.Disconnected &&
				this.userService.getUserStatus(game.usersID[1]) != status.Disconnected)
				game.pong.pause(false);
			return game.id
		}
		return undefined
	}

	disconnectUser(user:UserSocket){
		if (user) {
			this.removeFromQueue([user.id])
			if (user.gameID){
				let game:GAMES_SOCKET = this.findGame(user.gameID)
				game.pong.pause(true);
			}
		}
	}
	createGame(users:UserSocket[], mode:gamemode):GAMES_SOCKET{
		let gameID = "game_" + s4()
		if (this.Games.length){
			while (this.Games.find((game) => {return game.id === gameID}))
				gameID = "game_" + s4()
		}
		let game:GAMES_SOCKET = {
			id:gameID,
			spectatesID:[],
			usersID:users.map(user => {return user.id}),
			pong:this.initPong(users, mode, gameID)
		}
		this.Games.push(game)
		for (let idx in users){
			users[idx].gameID = gameID
			users[idx].socket.join(gameID)
		}
		return game
	}

	initPong(users:UserSocket[], mode:gamemode, gameID:string):Pong{
		let pongUser = users.map((user, index)=> {
			return {
				id:user.id,
				username:user.username,
			}
		})
		return new this.mode[mode]({users:pongUser,time:Date.now(), mode}, this.gameEnd.bind(this), gameID)
	}

	gameEnd(gameID:string){
		let game:GAMES_SOCKET = this.findGame(gameID)
		this.userService.saveGame(game)
		for (let id of game.usersID){
			let user:UserSocket = this.userService.findConnectedUserById(id)
			if (user){
				user.socket.emit("GAME_END")
				user.challenged = false
				user.socket.leave(gameID)
				user.status = status.Connected
				user.gameID = undefined
			}
		}
		for (let id of game.spectatesID){
			let user:UserSocket = this.userService.findConnectedUserById(id)
			if (user){
				user.socket.emit("GAME_END")
				user.socket.leave(gameID)
				user.status = status.Connected
				user.gameID = undefined
			}
		}
		this.removeGame(gameID)
	}
}
