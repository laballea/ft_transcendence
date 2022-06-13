import React, { useRef, useEffect } from 'react'

const Canvas = (props:any) => {
	const {height, width, game} = props
	const canvasRef = useRef<any>()
	const drawBall = (ctx:any) => {
		ctx.fillStyle = '#000000'
		ctx.beginPath()
		ctx.arc(game.ball.posx, game.ball.posy, 20, 0, 2*Math.PI)
		ctx.fill()
	}
	const drawPlayers = (ctx:any) => {
		ctx.fillStyle = '#666666'
		for (const user of game.users){
			ctx.fillRect(user.posx, user.posy, 20, 130)
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