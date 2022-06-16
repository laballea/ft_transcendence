import { Injectable } from '@nestjs/common';
import { GAMES_SOCKET, GAME_STATUS } from 'src/common/types';
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
	removeFromQueue(userID:number):boolean{
		if (this.Queue.includes(userID)){
			this.Queue.splice(this.Queue.indexOf(userID), 1)
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
	createGame(users:UserSocket[]):string{
		let gameID = "game_" + s4()
		if (this.Games.length){
			while (this.Games.find((game) => {return game.id === gameID}))
				gameID = "game_" + s4()
		}
		this.Games.push({
				id:gameID,
				usersID:users.map(user => {return user.id}),
				game:new PongInstance ({
					users:users.map((user, index)=> {
						return {
							id:user.id,
							username:user.username,
							posx:[50, 1900 - 55][index],
							posy:1000/2 - 300,
							point:0,
							speed:33,
							keyPress: 0//0=none, -1=up, 1=down
						}
					}),
					ball:{
						posx:1900 / 2,
						posy: 1000 / 2,
						speed:8,
						d:{x:0, y:0},
						size:30 //rayon
					},
					status:GAME_STATUS.COUNTDOWN,
					time:Date.now(),
					countDown:5
				})
			}
		)
		for (let idx in users){
			users[idx].gameID = gameID
			users[idx].socket.join(gameID)
		}
		return gameID
	}
}
