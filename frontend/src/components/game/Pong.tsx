// Components

// Hooks
import React, {useState, useEffect, useRef, useContext} from 'react'
import { useSelector } from 'react-redux'
import { GAME_STATUS } from '../../common/types';

//
import { mouseClickSocket, SocketContext } from '../../context/socket';
import Canvas from './Canvas';

const Pong = () => {
	const global = useSelector((state: any) => state.global)
	const socket = useContext(SocketContext);
	const [game, setGame] = useState(null)
	const [width, setWidth] = useState(100);
	const [height, setHeight] = useState(100);
	const overlayEl = useRef<HTMLDivElement>(null);

	const keyDown = (event:KeyboardEvent) => {
		const key = event.key; // "ArrowRight", "ArrowLeft", "ArrowUp", or "ArrowDown"
		socket.emit("KEYPRESS", {
			dir:key,
			id:global.id,
			gameID:global.gameID,
			on:true,
			jwt: global.token
		})
	}
	const keyUp = (event:KeyboardEvent) => {
		const key = event.key;
		socket.emit("KEYPRESS", {
			dir:key,
			id:global.id,
			gameID:global.gameID,
			on:false,
			jwt: global.token
		})
	}

	const mouseDown = (event:MouseEvent) => {
		if (overlayEl.current != null) {
			let width = overlayEl.current.clientHeight * 1.9 > (window.innerWidth - 400) ? window.innerWidth - 400 : overlayEl.current.clientHeight * 1.9;
			let height = overlayEl.current.clientHeight * 1.9 > (window.innerWidth - 400) ? (window.innerWidth - 400)/ 1.9 : overlayEl.current.clientHeight;
			var rect = overlayEl.current.getBoundingClientRect()
			let mouse:{
				x:number,
				y:number
			} = {x:event.clientX, y:event.clientY}
			mouse.y -= rect.top
			if (mouse.y >= 0 && mouse.x >= 0 && mouse.y <= height && mouse.x <= width) {
				mouseClickSocket(global, {x:mouse.x / (width / 1900), y:mouse.y / (width / 1900)})
			}
		}
	}
	const getgame = () => {
		const requestOptions = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
				'Access-Control-Allow-Origin': '*',
				'Authorization': 'bearer ' + global.token,
			},
		}
		fetch(`http://${process.env.REACT_APP_ip}:5000/game/games/${global.gameID}`, requestOptions)
		.then(async response=>{
			let resp = await response.json();
			setGame(resp)
			if (resp.status !== GAME_STATUS.WINNER && global.gameID !== undefined)
				setTimeout(getgame.bind(global), 16);
		})
	}
	useEffect(() => {
		if (global.gameID != undefined)
			getgame()
		window.addEventListener('keydown',keyDown, true);
		window.addEventListener('keyup', keyUp, true);
		window.addEventListener('mousedown', mouseDown, true);
		return () => {
			window.removeEventListener('keydown', keyDown, true)
			window.removeEventListener('keyup', keyUp, true)
			window.removeEventListener('mousedown', mouseDown, true)
		};
	// eslint-disable-next-line
	}, []);

	useEffect(() => {
		const resizeObserver = new ResizeObserver((event) => {
			if (overlayEl.current != null) {
				let limitHeight = window.innerHeight - 250
				let limitWidth = window.innerWidth - 450
				let tmpwidth = limitWidth;
				let tmpheight = limitWidth / 1.9;
				if (tmpheight >= limitHeight){
					tmpheight = limitHeight
					tmpwidth = limitHeight * 1.9
				}
				setWidth(tmpwidth)
				setHeight(tmpheight)
			}
		});
		resizeObserver.observe(document.getElementById("GameDiv")!);
	})
	return (
		<div ref={overlayEl} className="relative flex h-full justify-center items-center p-[24px] overflow-hidden animate-slidein" id="GameDiv">
			{
				<div className="relative w-full h-auto" >
					{game != null && <Canvas width={width} global={global} height={height} game={game} username={global.username} ratio={width / 1900}/>}
				</div>
			}
		</div>
	)
}

export default Pong