import React, { useRef, useEffect } from 'react'

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
		}
		render()
		
		return () => {
			window.cancelAnimationFrame(animationFrameId)
		}
	})

	return <canvas style={{position:"relative"}} ref={canvasRef} width={width} height={height}/>
}

export default Canvas