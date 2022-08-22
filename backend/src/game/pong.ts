import { GameI, GameUserI, GameBallI, GAME_STATUS, gamemode } from 'src/common/types';

export class Pong {
	constructor(
		game:GameI,
		gameEnd:any,
		gameID:string
	) {
		this.users = game.users
		this.mode = game.mode
		this.status = GAME_STATUS.COUNTDOWN
		this.map = {width:1900, height:1000}
		this.timeBegin = game.time
		this.countDown = 5
		this.winner = {username:undefined, id:-1}
		this.gameEnd = gameEnd
		this.gameID = gameID
		this.maxBallSpeed = 0
		this.ball
		this.init()
	}
	protected mode:gamemode
	protected users:GameUserI[]
	public status:GAME_STATUS
	protected ball:GameBallI
	protected map: {width:number, height:number}
	protected timeBegin: number
	protected countDown: number
	protected winner: {username:string,id:number}
	protected gameEnd:any
	protected gameID:string
	protected maxBallSpeed:number

	init(){
		this.users = this.users.map((user, index)=> {
			return {
				id:user.id,
				username:user.username,
				posx:[50, 1900 - 55][index],
				pos:["left", "right"][index],
				posy:1000/2 - 150,
				point:0,
				speed:33,
				clickpos:[],
				keyPress: 0//0=none, -1=up, 1=down
			}
		})
		this.ball = {
			posx:1900 / 2,
			posy: 1000 / 2,
			speed:20,
			angle:this.randomNumber(0, 360),
			d:{x:0, y:0},
			size:30 //rayon
		}
		this.ball.d = this.randomDir(0)
	}

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
			let velocity = {x:speed * Math.cos(this.ball.angle), y:speed * Math.sin(this.ball.angle)}
			let newPosx = this.ball.posx + velocity.x
			let newPosy = this.ball.posy + velocity.y
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
					if (this.between(newPosx + (velocity.x / 5) * this.ball.size, idx ? user.posx : user.posx + 5, idx ? user.posx + 15: user.posx + 20)){
						this.ball.angle = (this.ball.angle + (this.ball.angle ? -180 : 180)) % 360
						this.ball.speed += 1
						if (this.ball.speed > this.maxBallSpeed)
							this.maxBallSpeed = this.ball.speed
						bounce = true
					}
				}
			}
			if ((hit.bot || hit.top) && !bounce) {
				newPosy = hit.bot ? this.ball.size : (this.map.height  - this.ball.size)
				console.log(this.ball.angle)
				this.ball.angle = (this.ball.angle + (this.ball.angle ? -180 : 180)) % 360
				console.log(this.ball.angle)
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
				this.ball.angle = this.randomNumber(0, 360)
				//this.ball.d = this.randomDir(newPosx < this.ball.size ? 1 : 0)
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
			mode:this.mode,
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

	mouseclick(userID:number, pos:{x:number, y:number}){
		let user = this.users.find((user) => user.id == userID)
		if (user.clickpos.length < 3) {
			if (user.clickpos.length < 1)
				user.clickpos.push(pos)
			else {
				let last = user.clickpos[user.clickpos.length - 1]
				if (last) {
					if (user.pos == "left") {
						if (pos.x > last.x)
							user.clickpos.push(pos)
					}else {
						if (pos.x < last.x)
							user.clickpos.push(pos)
					}
				}
			}
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
