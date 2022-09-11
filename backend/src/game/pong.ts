import { GameI, GameUserI, GameBallI, GAME_STATUS, gamemode } from 'src/common/types';
import { UserI } from 'src/user/models/user.interface';

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
	public	status:GAME_STATUS
	protected ball:GameBallI
	protected map: {width:number, height:number}
	protected timeBegin: number
	protected countDown: number
	protected winner: {username:string,id:number}
	protected gameEnd:any
	protected gameID:string
	protected maxBallSpeed:number

	angle(ax, ay, bx, by) {
		var dy = by - ay;
		var dx = bx - ax;
		var theta = Math.atan2(dy, dx); // range [-PI, PI]

		return theta;
	}

	init(){
		this.ball = {
			posx:1900 / 2,
			posy: 1000 / 2,
			speed:20,
			angle:45* (Math.PI/180),
			d:{x:0, y:0},
			size:30 //rayon
		}
		this.ball.d = {x:Math.cos(this.ball.angle), y:Math.sin(this.ball.angle)}
		//this.ball.d = this.randomDir(0)
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
					this.gameEnd(this.gameID, true)
				}
				break ;
			}
			case (GAME_STATUS.PAUSE):{
				this.countDown -= 0.030;
				if (this.countDown <= 0) {
					this.status = GAME_STATUS.ENDED;
					this.gameEnd(this.gameID, true)
				}
				break ;
			}
		}
		if (this.status != GAME_STATUS.ENDED){
			setTimeout(function () {this.run()}.bind(this), 16)
		}
	}

	ballTrajectory(){
		let factor = this.ball.speed / 10
		for (let i=1; i < factor; i++) {
			let speed = this.ball.speed / factor
			let newPosx = this.ball.posx + (this.ball.d.x) * speed
			let newPosy = this.ball.posy + (this.ball.d.y) * speed
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
				this.ball.angle = this.randomNumber(0, 360)
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

	giveUp(userID:number){
		for (const idx in this.users){
			let user = this.users[idx]
			if (user.id !== userID){
				this.status = GAME_STATUS.WINNER
				this.countDown = 5
				user.point = 5
				this.winner = {
					username:user.username,
					id:user.id
				}
				break ;
			}
		}

	}
	updateUser(userDb:UserI){
		for (const idx in this.users){
			let user = this.users[idx]
			if (user.id === userDb.id){
				user.username = userDb.username
				user.profilPic = userDb.profilPic
				break ;
			}
		}
	}
	pause(status:boolean, userId:number){
		if (status){
			this.countDown = 10
			for (const user of this.users){
				if (user.id != userId){
					this.winner = {
						username:user.username,
						id:user.id
					}
				}
			}
			this.status = GAME_STATUS.PAUSE
		}
		else {
			this.countDown = 5
			for (const user of this.users){
				if (user.id != userId){
					this.winner = {
						username:undefined,
						id:-1
					}
				}
			}
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

	getMode(){
		return this.mode
	}
}
