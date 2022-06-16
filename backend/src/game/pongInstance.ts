import { GameI, GameUserI, GameBallI, GAME_STATUS } from 'src/common/types';

export class PongInstance {
	constructor(
		game:GameI
	) {
		this.users = game.users
		this.status = game.status
		this.ball = game.ball
		this.ball.d = this.randomDir(0)
		this.map = {width:1900, height:1000}
		this.timeBegin = game.time
		this.countDown = game.countDown
	}
	private users:GameUserI[]
	private status:GAME_STATUS
	private ball:GameBallI
	private map: {width:number, height:number}
	private timeBegin: number
	private countDown: number

	between(x:number, min:number, max:number) {
		return x >= min && x <= max;
	}

	randomDir(winner:number){
		let dir = winner != 0 ? -winner : Math.floor(Math.random()) == 0 ? -1 : 1
		return (
			{
				x:Math.random() * dir,
				y:Math.random() * (Math.random() * 2 - 1)
			}
		)
	}

	game() {
		if (this.status == GAME_STATUS.COUNTDOWN){
			this.countDown -= 0.015
			if (this.countDown <= 0) {
				this.status = GAME_STATUS.RUNNING;
				this.countDown = 3;
			}
		}
		if (this.status == GAME_STATUS.RUNNING){
			for (let user of this.users) {
				if (user.keyPress != 0){
					let newPos = user.posy + (user.keyPress * user.speed)
					user.posy = newPos > this.map.height - 300 ? this.map.height - 300 : newPos < 0 ? 0 : newPos
				}
			}
			this.ballTrajectory();
		}
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
			if (newPosx < this.ball.size)//score on left
				this.users[1].point += 1
			else
				this.users[0].point += 1
			this.status = GAME_STATUS.COUNTDOWN
			newPosx = this.map.width / 2
			newPosy = this.map.height / 2
			this.ball.speed = 8
			this.ball.d = this.randomDir(newPosx < this.ball.size ? 1 : 0)
		}
		for (let idx in this.users){
			let user = this.users[idx]
			if (this.between(newPosy + Math.sign(this.ball.d.y) * this.ball.size, user.posy - this.ball.size, user.posy + this.ball.size + 300)){
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
			ball: this.ball,
			time:this.timeBegin,
			countDown:this.countDown
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
