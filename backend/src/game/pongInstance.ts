import { GameI, GameUserI, GameBallI, GAME_STATUS } from 'src/common/types';

export class PongInstance {
	constructor(
		game:GameI
	) {
		this.users = game.users
		this.status = game.status
		this.ball = game.ball
		this.map = {width:1900, height:1000}
	}
	private users:GameUserI[]
	private status:GAME_STATUS
	private ball:GameBallI
	private map: {width:number, height:number}
	between(x:number, min:number, max:number) {
		return x >= min && x <= max;
	}
	game() {
		for (let user of this.users) {
			if (user.keyPress != 0){
				let newPos = user.posy + (user.keyPress * user.speed)
				user.posy = newPos > this.map.height - 300 ? this.map.height - 300 : newPos < 0 ? 0 : newPos
			}
		}
		this.ballTrajectory();
		if (this.status != GAME_STATUS.ENDED) {
			setTimeout(function () {this.game()}.bind(this), 15)
		}
	}

	ballTrajectory(){
		let newPosx = this.ball.posx + this.ball.speed * this.ball.d.x
		let newPosy = this.ball.posy + this.ball.speed * this.ball.d.y
		if (newPosy > this.map.height - this.ball.size || newPosy < this.ball.size) {
			newPosy = newPosy < this.ball.size ? this.ball.size : (this.map.height  - this.ball.size)
			this.ball.d.y *= -1
		}
		if (newPosx > this.map.width - this.ball.size || newPosx < this.ball.size) {
			newPosx = newPosx < this.ball.size? this.ball.size : (this.map.width - this.ball.size)
			this.ball.d.x *= -1
		}
		for (let idx in this.users){
			let user = this.users[idx]
			if (this.between(newPosy + Math.sign(this.ball.d.y) * this.ball.size, user.posy, user.posy + 300)){
				if (this.between(newPosx + Math.sign(this.ball.d.x) * this.ball.size, idx ? user.posx : user.posx + 5, idx ? user.posx + 15: user.posx + 20)){
					this.ball.d.x *= -1
					this.ball.speed += 1
				}
			}
		}
		this.ball.posx = newPosx
		this.ball.posy = newPosy
	}

	getGameInfo(): GameI {
		return {
			users: this.users,
			status: this.status,
			ball: this.ball
		}
	}

	keyPress(userID:number, dir:number, on:boolean){
		let user = this.users.find((user) => user.id == userID)
		if (on){
			user.keyPress = dir
		} else if (user.keyPress == dir) {
			user.keyPress = 0
		}
	}
}
