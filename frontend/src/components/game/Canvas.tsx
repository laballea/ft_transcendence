import React, { useRef, useEffect } from 'react'
import { GAME_STATUS } from '../../common/types'
import { mousemoveSocket } from '../../context/socket'

const Canvas = (props:any) => {
	const {height, width, game, ratio, username, global} = props
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
	const drawStatus = (ctx:any) => {
		let textString;
		switch(game.status) {
			case(GAME_STATUS.COUNTDOWN):{
				ctx.font = "30px Arial";
				textString = Math.ceil(game.countDown)
				ctx.fillText(textString, width / 2 - ctx.measureText(textString).width / 2, height / 2);
				break;
			}
			case (GAME_STATUS.WINNER):{
				ctx.font = "30px Arial";
				textString = "WINNER " + game.winner.username
				ctx.fillText(textString, width / 2 - ctx.measureText(textString).width/2, height / 2);
				break ;
			}
			case (GAME_STATUS.PAUSE):{
				ctx.font = "30px Arial";
				textString = "PAUSE"
				ctx.fillText(textString, width / 2 - ctx.measureText(textString).width/2, height / 2);
				break ;
			}
		}
	}
	const mousemove = (event:MouseEvent, ctx:any) => {
		var rect = canvasRef.current.getBoundingClientRect(), // abs. size of element
		scaleX = canvasRef.current.width / rect.width,    // relationship bitmap vs. element for x
		scaleY = canvasRef.current.height / rect.height;  // relationship bitmap vs. element for y
		ctx.strokeStyle = "blue";
		let posx = (event.clientX - rect.left) * scaleX
		let posy = (event.clientY - rect.top) * scaleY
		for (const user of game.users){
			if (user.username === username){
				ctx.beginPath();
				ctx.moveTo(user.posx * ratio, user.posy * ratio + 0.15 * height);
				ctx.lineTo(posx, posy);
				ctx.stroke();
				mousemoveSocket(global, ( posy - user.posy ) / ( posx - user.posx ))
			}
		}
	  }
	useEffect(() => {
		const canvas = canvasRef.current
		const context = canvas.getContext('2d')
		let animationFrameId:any
		
		//Our draw came here
		window.addEventListener('mousemove', function(event:MouseEvent) {mousemove(event, context)});

		const render = () => {
			let textString;
			context.clearRect(0, 0, context.canvas.width, context.canvas.height)
			context.strokeStyle = "green";
			context.strokeRect(0, 0, width - 1, height - 1);
			drawBall(context)
			drawPlayers(context)
			drawStatus(context)
			context.font = "30px Arial";
			textString = game.users[0].point + " - " + game.users[1].point
			context.fillText(textString, width / 2 - context.measureText(textString).width/2, 30);
		}
		render()
		
		return () => {
			window.removeEventListener('mousemove', function(event:MouseEvent) {mousemove(event, context)})
			window.cancelAnimationFrame(animationFrameId)
		}
	})

	return <canvas style={{position:"relative"}} ref={canvasRef} width={width} height={height}/>
}

export default Canvas