import { GameI } from 'src/common/types';
import { Pong } from '../pong';

export class Normal extends Pong {
	constructor(
		game:GameI,
		gameEnd:any,
		gameID:string
	) {
		super(game, gameEnd, gameID)
	}
}
