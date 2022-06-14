import { GameI, GameUserI, GAME_STATUS } from 'src/common/types';

export class PongInstance {
	constructor(
		game:GameI
	) {
		this.users = game.users
		this.status = game.status
		this.ball = game.ball
	}
	private users:GameUserI[]
	private status:GAME_STATUS
	private ball:{posx:number, posy:number}

	game() {
		this.ball.posx += 1
		if (this.status != GAME_STATUS.ENDED) {
			setTimeout(function () {this.game()}.bind(this), 30)
		}
	}

	getGameInfo(): GameI {
		return {
			users: this.users,
			status: this.status,
			ball: this.ball
		}
	}
}
