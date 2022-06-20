import { Injectable, Inject } from '@nestjs/common';
import { GameI, GAMES_SOCKET, GAME_STATUS, status } from 'src/common/types';
import { User } from 'src/user/models/user.entity';
import { UserSocket } from 'src/user/models/user.interface';
import { UserService } from 'src/user/user.service';
import { PongInstance } from './pongInstance';

let s4 = () => {
	return Math.floor((1 + Math.random()) * 0x10000)
		.toString(16)
		.substring(1);
  }

@Injectable()
export class GameService {
	constructor(
		private userService:UserService,
	){}
	public Games: GAMES_SOCKET[] = [];
	public Queue: number[] = [];

	addToQueue(user:UserSocket):boolean{
		if (!this.Queue.includes(user.id)){
			this.Queue.push(user.id)
			return true
		}
		return false
	}
	removeFromQueue(userID:number[]){
		for (let id of userID){
			if (this.Queue.includes(id))
				this.Queue.splice(this.Queue.indexOf(id), 1)
		}
	}
	removeGame(gameID:string):boolean{
		if (this.Games.find((game)=>game.id==gameID)){
			this.Games.splice(this.Games.findIndex((game)=>game.id==gameID), 1)
			return true
		}
		return false
	}

	findOtherPlayer(user:UserSocket):number{
		if (this.Queue.length > 1) {
			let other = this.Queue.find((id)=>id !== user.id && this.userService.getUserStatus(id))
			return other
		}
		return -1
	}

	findGame(id:string):GAMES_SOCKET{
		let res = this.Games.find(game => {return game.id == id})
		return res
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
		this.removeFromQueue([user.id])
		if (user.gameID){
			let game:GAMES_SOCKET = this.findGame(user.gameID)
			game.pong.pause(true);
		}
	}
	createGame(users:UserSocket[]):GAMES_SOCKET{
		let gameID = "game_" + s4()
		if (this.Games.length){
			while (this.Games.find((game) => {return game.id === gameID}))
				gameID = "game_" + s4()
		}
		let game:GAMES_SOCKET = {
			id:gameID,
			usersID:users.map(user => {return user.id}),
			pong:new PongInstance ({
				users:users.map((user, index)=> {
					return {
						id:user.id,
						username:user.username,
						posx:[50, 1900 - 55][index],
						posy:1000/2 - 150,
						point:0,
						speed:33,
						keyPress: 0//0=none, -1=up, 1=down
					}
				}),
				ball:{
					posx:1900 / 2,
					posy: 1000 / 2,
					speed:30,
					d:{x:0, y:0},
					size:30 //rayon
				},
				status:GAME_STATUS.COUNTDOWN,
				time:Date.now(),
				countDown:5,
				winner:undefined
			}, this.gameEnd.bind(this), gameID)
		}
		this.Games.push(game)
		for (let idx in users){
			users[idx].gameID = gameID
			users[idx].socket.join(gameID)
		}
		return game
	}

	gameEnd(gameID:string){
		let game:GAMES_SOCKET = this.findGame(gameID)
		for (let id of game.usersID){
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
