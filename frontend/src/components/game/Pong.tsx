// Components

// Hooks
import React, {useState, useEffect, useRef, useContext} from 'react'
import { useSelector } from 'react-redux'

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

	var eventSource:EventSource;

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

	useEffect(() => {
		// eslint-disable-next-line
		eventSource = new EventSource(`http://localhost:5000/game/` + global.gameID);

		eventSource.onmessage = async ({ data }) => {
			const json = await JSON.parse(data)
			setGame(json.game)
		}
		window.addEventListener('keydown',keyDown, true);
		window.addEventListener('keyup', keyUp, true);
		window.addEventListener('mousedown', mouseDown, true);
		return () => {
			window.removeEventListener('keydown', keyDown, true)
			window.removeEventListener('keyup', keyUp, true)
			window.removeEventListener('mousedown', mouseDown, true)
			eventSource.close()
		};
	}, []);

	useEffect(() => {
		const resizeObserver = new ResizeObserver((event) => {
			if (overlayEl.current != null) {
					let width = overlayEl.current.clientHeight * 1.9 > (window.innerWidth - 400) ? window.innerWidth - 400 : overlayEl.current.clientHeight * 1.9;
					let height = overlayEl.current.clientHeight * 1.9 > (window.innerWidth - 400) ? (window.innerWidth - 400)/ 1.9 : overlayEl.current.clientHeight;
					setWidth(width)
					setHeight(height)
					console.log(height)
				}
		});
		resizeObserver.observe(document.getElementById("GameDiv")!);
	})
	return (
		<div  className="relative flex h-full justify-center items-center p-[24px] overflow-hidden" id="GameDiv">
			<div className="relative w-full h-full" ref={overlayEl}>
				{game != null && <Canvas width={width} global={global} height={height} game={game} username={global.username} ratio={width / 1900}/>}
			</div>
		</div>
	)
}

export default Pong