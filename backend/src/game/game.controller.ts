import { Body, Controller, Param, Sse, Query, Get } from '@nestjs/common';
import { interval, Observable, mergeMap } from 'rxjs';
import { GameService } from './game.service';
@Controller('game')
export class GameController {
	constructor(private gameService:GameService) {}

	@Get('queue')
	getQueue():any {
		return this.gameService.Queue;
	}

	@Get('games')
	getGames():any {
		return this.gameService.Games.map(game => {return {
			id:game.id,
			game:game.game
		}});
	}


	/*
	*/
	@Sse(':id')
	sse(@Query() query, @Param() param): Observable<any> {
		return interval(15).pipe(
			mergeMap( async (_) => {return {data : { game: this.gameService.findGame(param.id).game.getGameInfo()}}}
		));
	}
}