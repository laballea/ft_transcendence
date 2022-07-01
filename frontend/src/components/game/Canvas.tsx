import React, { useRef, useEffect } from 'react'
import { GAME_STATUS } from '../../common/types'

const Canvas = (props:any) => {
	const {height, width, game, ratio, username} = props
	const canvasRef = useRef<any>()
	const drawBall = (ctx:any) => {
		ctx.fillStyle = '#000000'
		ctx.beginPath()
		ctx.arc(game.ball.posx * ratio, game.ball.posy * ratio, game.ball.size * ratio, 0, 2*Math.PI)
		ctx.font = "15px Arial";
		ctx.fillText((game.ball.speed * 0.00026 / 0.025).toFixed(2) + "m/s", 5, 15);
		ctx.fill()
	}
	const drawPlayers = (ctx:any) => {
		for (const user of game.users){
			ctx.fillStyle = '#666666'
			if (user.username === username)
				ctx.fillStyle = '#659B5E'
			ctx.fillRect(user.posx * ratio, user.posy * ratio, 5,  0.3 * height)
		}
		ctx.fillStyle = '#666666'
	}
	useEffect(() => {
		const canvas = canvasRef.current
		const context = canvas.getContext('2d')
		let animationFrameId:any
		
		//Our draw came here
		const render = () => {
			context.clearRect(0, 0, context.canvas.width, context.canvas.height)
			context.strokeStyle = "green";
			context.strokeRect(0, 0, width, height - 1);
			drawBall(context)
			drawPlayers(context)
			if (game.status === GAME_STATUS.COUNTDOWN){
				context.font = "30px Arial";
				context.fillText(Math.ceil(game.countDown), width / 2, height / 2);
			}
			if (game.status === GAME_STATUS.WINNER){
				context.font = "30px Arial";
				context.fillText("WINNER " + game.winner, width / 2, height / 2);
			}
			if (game.status === GAME_STATUS.PAUSE){
				context.font = "30px Arial";
				context.fillText("PAUSE", width / 2, height / 2);
			}
			context.fillText(game.users[0].point + " - " + game.users[1].point, width / 2, 50);
		}
		render()
		
		return () => {
			window.cancelAnimationFrame(animationFrameId)
		}
	})

	return <canvas style={{position:"relative"}} ref={canvasRef} width={width} height={height}/>
}

export default Canvas