import { Body, Controller, Param, Sse, Query, Get, UseGuards } from '@nestjs/common';
import { interval, Observable, mergeMap } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/auth.guard';
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
			game:game.pong
		}});
	}

	@Get('games/:id')
	@UseGuards(JwtAuthGuard)
	getGamesId(@Param() param):any {
		return this.gameService.findGame(param.id).pong.getGameInfo()
	}

	/*
	*/
	/*@Sse(':id')
	sse(@Query() query, @Param() param): Observable<any> {
		return interval(30).pipe(
			mergeMap( async (_) => {return {data : { game: this.gameService.findGame(param.id).pong.getGameInfo()}}}
		));
	}*/
}