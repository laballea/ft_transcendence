import { GameI, GameUserI, GameBallI, GAME_STATUS, gamemode } from 'src/common/types';

export class PongInstance {
	constructor(
		game:GameI,
		gameEnd:any,
		gameID:string
	) {
		this.users = game.users
		this.mode = game.mode
		this.status = game.status
		this.ball = game.ball
		this.ball.d = this.randomDir(0)
		this.map = {width:1900, height:1000}
		this.timeBegin = game.time
		this.countDown = game.countDown
		this.winner = {username:undefined, id:-1}
		this.gameEnd = gameEnd
		this.gameID = gameID
		this.maxBallSpeed = 0
	}
	private users:GameUserI[]
	private mode:gamemode
	private status:GAME_STATUS
	private ball:GameBallI
	private map: {width:number, height:number}
	private timeBegin: number
	private countDown: number
	private winner: {username:string,id:number}
	private gameEnd:any
	private gameID:string
	private maxBallSpeed:number

	between(x:number, min:number, max:number) {
		return x >= min && x <= max;
	}
	randomNumber(min, max) { 
		return Math.random() * (max - min) + min;
	} 
	randomDir(winner:number){
		let dir = winner != 0 ? -winner : Math.round(Math.random()) == 0 ? -1 : 1
		return (
			{
				x:this.randomNumber(0.5, 1) * dir,
				y:this.randomNumber(0.5, 1) * Math.round(Math.random()) == 0 ? -1 : 1
			}
		)
	}

	run() {
		switch (this.status){
			case (GAME_STATUS.COUNTDOWN):{
				this.countDown -= 0.030
				if (this.countDown <= 0) {
					this.status = GAME_STATUS.RUNNING;
					this.countDown = 3;
				}
				break ;
			}
			case (GAME_STATUS.RUNNING):{
				/* handle user keypress */
				for (let user of this.users) {
					if (user.keyPress != 0){
						let newPos = user.posy + (user.keyPress * user.speed)
						user.posy = newPos > this.map.height - 300 ? this.map.height - 300 : newPos < 0 ? 0 : newPos
					}
				}
				this.ballTrajectory();
				break ;
			}
			case (GAME_STATUS.WINNER):{
				this.countDown -= 0.030;
				if (this.countDown <= 0) {
					this.status = GAME_STATUS.ENDED;
					this.gameEnd(this.gameID)
				}
				break ;
			}
		}
		if (this.status != GAME_STATUS.ENDED){
			setTimeout(function () {this.run()}.bind(this), 30)
		}
	}

	ballTrajectory(){
		for (let i=1; i < this.ball.speed / 5; i++) {
			let speed = this.ball.speed / 5
			let newPosx = this.ball.posx + speed * this.ball.d.x
			let newPosy = this.ball.posy + speed * this.ball.d.y
			let bounce = false
			let hit = {
				bot:newPosy < this.ball.size,
				top:newPosy > this.map.height - this.ball.size,
				left:newPosx < this.ball.size,
				right:newPosx > this.map.width - this.ball.size,
			}
			for (let idx in this.users){
				let user = this.users[idx]
				if (this.between(newPosy, user.posy - this.ball.size, user.posy + this.ball.size + 300)){
					if (this.between(newPosx + Math.sign(this.ball.d.x) * this.ball.size, idx ? user.posx : user.posx + 5, idx ? user.posx + 15: user.posx + 20)){
						this.ball.d.x *= -1
						this.ball.speed += 1
						if (this.ball.speed > this.maxBallSpeed)
							this.maxBallSpeed = this.ball.speed
						bounce = true
					}
				}
			}
			if ((hit.bot || hit.top) && !bounce) {
				newPosy = hit.bot ? this.ball.size : (this.map.height  - this.ball.size)
				this.ball.d.y *= -1
				bounce = true
			}
			if ((hit.left || hit.right) && !bounce) {
				this.users[(hit.left ? 1 : 0)].point += 1 // add point to user
				this.status = GAME_STATUS.COUNTDOWN
				if (this.users[(hit.left ? 1 : 0)].point >= 5) {
					this.status = GAME_STATUS.WINNER
					this.winner = {
						username:this.users[(hit.left ? 1 : 0)].username,
						id:this.users[(hit.left ? 1 : 0)].id
					}
				}
				for (let user of this.users)
					user.posy = 1000 / 2 - 150;
				newPosx = this.map.width / 2
				newPosy = this.map.height / 2
				this.ball.speed = 20
				this.ball.d = this.randomDir(newPosx < this.ball.size ? 1 : 0)
				bounce = true
			}
			this.ball.posx = newPosx
			this.ball.posy = newPosy
			if (bounce)
				break ;
		}
	}

	getGameInfo(): GameI {
		return {
			users: this.users,
			status: this.status,
			ball: this.ball,
			time:this.timeBegin,
			countDown:this.countDown,
			winner:this.winner,
			mode:this.mode
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

	pause(status:boolean){
		if (status)
			this.status = GAME_STATUS.PAUSE
		else {
			this.countDown = 5
			this.status = GAME_STATUS.COUNTDOWN
		}
	}

	getWinner(){
		return this.winner
	}

	getDuration(){
		return Date.now() - this.timeBegin
	}

	getMaxBallSpeed(){
		return this.maxBallSpeed
	}

	getScore(){
		return [this.users[0].point, this.users[1].point]
	}
}
