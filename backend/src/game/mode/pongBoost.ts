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
	}
	private balltraj: {x:number, y:number}[]

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
						this.balltraj = user.clickpos
						if (this.balltraj.length > 0) {
							this.ball.angle = this.angle(this.ball.posx, this.ball.posy,
							this.balltraj[0].x, this.balltraj[0].y)
							this.ball.d = {x:Math.cos(this.ball.angle), y:Math.sin(this.ball.angle)}
						} else {
							this.ball.d.x *= -1
						}
						user.clickpos = []
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
}
