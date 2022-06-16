import React, { useRef, useEffect } from 'react'
import { GAME_STATUS } from '../../common/types'

const Canvas = (props:any) => {
	const {height, width, game, ratio} = props
	const canvasRef = useRef<any>()
	const drawBall = (ctx:any) => {
		ctx.fillStyle = '#000000'
		ctx.beginPath()
		ctx.arc(game.ball.posx * ratio, game.ball.posy * ratio, game.ball.size * ratio, 0, 2*Math.PI)
		ctx.fill()
	}
	const drawPlayers = (ctx:any) => {
		ctx.fillStyle = '#666666'
		for (const user of game.users){
			ctx.fillRect(user.posx * ratio, user.posy * ratio, 5,  0.3 * height)
		}
	}
	useEffect(() => {
		const canvas = canvasRef.current
		const context = canvas.getContext('2d')
		let frameCount = 0
		let animationFrameId:any
		
		//Our draw came here
		const render = () => {
			context.clearRect(0, 0, context.canvas.width, context.canvas.height)
			context.strokeStyle = "green";
			context.strokeRect(0, 0, width, height - 1);
			drawBall(context)
			drawPlayers(context)
			if (game.status == GAME_STATUS.COUNTDOWN){
				context.font = "30px Arial";
				context.fillText(Math.trunc(game.countDown), width / 2, height / 2);
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