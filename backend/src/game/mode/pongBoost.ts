import { GameI, GameUserI, GameBallI, GAME_STATUS } from 'src/common/types';
import { Pong } from '../pong';

export class Boost extends Pong {
	constructor(
		game:GameI,
		gameEnd:any,
		gameID:string
	) {
		super(game, gameEnd, gameID)
		this.balltraj = []
		this.balltrajpos = 0
	}
	private balltraj: {x:number, y:number}[]
	private balltrajpos: number


	calculateBounce(posY:number, pos:string):number{
		let diff = Math.PI * 0.5
		let angle = -(Math.PI / 2) + (pos == "left" ? Math.PI * 0.25 : -Math.PI * 0.25)
		for (let i = 0; i < 300; i += 300/6){
			if (i >= posY){
				break;
			}
			angle += (pos == "left" ? diff/6 : -diff/6)
		}
		return (angle)
	}


	ballTrajectory(){
		let factor = this.ball.speed / 10
		for (let i=0; i < factor; i++) {
			let speed = this.ball.speed / factor
			let newPosx = this.ball.posx + speed * this.ball.d.x
			let newPosy = this.ball.posy + speed * this.ball.d.y
			let bounce = false
			let hit = {
				bot:newPosy < this.ball.size,
				top:newPosy > this.map.height - this.ball.size,
				left:newPosx < this.ball.size,
				right:newPosx > this.map.width - this.ball.size,
			}
			if (this.balltraj && this.balltraj[this.balltrajpos ]) {
				if ((this.ball.d.x <0 && this.ball.posx <= this.balltraj[this.balltrajpos].x) ||
					(this.ball.d.x >0 && this.ball.posx >= this.balltraj[this.balltrajpos].x)){
					if (this.balltraj[this.balltrajpos] && this.balltrajpos >= 1) {
						this.ball.speed += 0.75
						this.ball.angle = this.angle(this.balltraj[this.balltrajpos - 1].x, this.balltraj[this.balltrajpos - 1].y, this.balltraj[this.balltrajpos].x, this.balltraj[this.balltrajpos].y)
						this.ball.d = {x:Math.cos(this.ball.angle), y:Math.sin(this.ball.angle)}
					}
					this.balltrajpos++;
				}
			}
			for (let idx in this.users){
				let user = this.users[idx]
				if (this.between(newPosy, user.posy - this.ball.size, user.posy + this.ball.size + 300)){
					if (this.between(newPosx + Math.sign(this.ball.d.x) * this.ball.size, idx ? user.posx : user.posx + 5, idx ? user.posx + 15: user.posx + 20)){
						this.balltraj = user.clickpos
						this.balltrajpos = 0
						if (this.balltraj[this.balltrajpos]) {
							this.ball.angle = this.angle(this.ball.posx, this.ball.posy, this.balltraj[this.balltrajpos].x, this.balltraj[this.balltrajpos].y)
							this.ball.d = {x:Math.cos(this.ball.angle), y:Math.sin(this.ball.angle)}
						} else {
							let angle:number = this.calculateBounce(newPosy - user.posy, user.pos)
							this.ball.d = {x:Math.cos(angle), y:Math.sin(angle)}
						}
						user.clickpos = []
						this.ball.speed += 1
						bounce = true
					}
				}
			}
			if ((hit.bot || hit.top) && !bounce) {
				newPosy = hit.bot ? this.ball.size : (this.map.height  - this.ball.size)
				this.ball.d.y *= -1
				this.ball.speed += 0.3
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
				this.ball.speed = 10 + this.users[0].point + this.users[1].point
				this.ball.d = this.randomDir(newPosx < this.ball.size ? 1 : 0)
				bounce = true
			}
			if (this.ball.speed > this.maxBallSpeed)
				this.maxBallSpeed = this.ball.speed
			this.ball.posx = newPosx
			this.ball.posy = newPosy
			if (bounce)
				break ;
		}
	}
}
