import { gamemode } from "src/common/types";
import { UserSocket } from "src/user/models/user.interface";

export class Queue {
	constructor(

	) {
		this.queue = new Map();
		for (let mode in gamemode)
			this.queue[mode] = [];
	
	}
	private queue:Map<gamemode, []>
	addToQueue(user:UserSocket, mode:gamemode):boolean{
		if (!this.queue[mode].includes(user.id)){
			this.queue[mode].push(user.id)
			return true
		}
		return false
	}
	removeFromQueue(userID:number[]){
		for (let id of userID){
			for (let mode in gamemode) {
				if (this.queue[mode].includes(id))
					this.queue[mode].splice(this.queue[mode].indexOf(id), 1)
			}
		}
	}

	findOtherPlayer(user:UserSocket, mode:gamemode):number{
		if (this.queue[mode].length > 1) {
			let other = this.queue[mode].find((id)=>id !== user.id)
			return other
		}
		return -1
	}

}
