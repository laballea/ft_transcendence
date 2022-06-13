import { Injectable } from '@nestjs/common';
import { GAMES_SOCKET, GAME_STATUS } from 'src/common/types';
import { User } from 'src/user/models/user.entity';
import { UserSocket } from 'src/user/models/user.interface';
import { UserService } from 'src/user/user.service';

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
			this.Queue.splice(userID, 1)
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
		console.log("res", res)
		return res
	}
	createGame(users:UserSocket[]):string{
		let gameID = s4()
		if (this.Games.length){
			while (this.Games.find((game) => {return game.id === gameID}))
				gameID = s4()
		}
		this.Games.push({
				id:gameID,
				usersID:users.map(user => {return user.id}),
				game:{
					users:users.map((user)=> {
						return {
							id:user.id,
							username:user.username,
							posx:0,
							posy:0,
							point:0,
						}
					}),
					ball:{
						posx:0,
						posy:0
					},
					status:GAME_STATUS.LOBBY,
				}
			}
		)
		for (let idx in users){
			users[idx].gameID = gameID
			users[idx].socket.join(gameID)
		}
		return gameID
	}
}
