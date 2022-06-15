// Components

// Hooks
import React, {useState, useEffect, useContext, useRef} from 'react'
import { useDispatch, useSelector } from 'react-redux'

//
import { SocketContext } from '../../context/socket';
import Canvas from './Canvas';
import { GameI } from '../../common/types';

let tmp:GameI = {
	users:[
		{id:0, username:"lol", posx:10, posy:10, point:0, you:true},
		{id:1, username:"test", posx:50, posy:50, point:0, you:false}
	],
	ball:{
		posx:25,
		posy:25
	}
}

const Pong = () => {
	const global = useSelector((state: any) => state.global)
	const socket = useContext(SocketContext);
	const [game, setGame] = useState(tmp)
	const dispatch = useDispatch()
	const [width, setWidth] = useState(100);
	const [height, setHeight] = useState(100);
	var eventSource:EventSource;

	const keyDown = (event:KeyboardEvent) => {
		const key = event.key; // "ArrowRight", "ArrowLeft", "ArrowUp", or "ArrowDown"
		console.log("PRESS")
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
		console.log("RELEASE")
		socket.emit("KEYPRESS", {
			dir:key,
			id:global.id,
			gameID:global.gameID,
			on:false,
			jwt: global.token
		})
	}
	useEffect(() => {
		// eslint-disable-next-line
		eventSource = new EventSource('http://localhost:5000/game/' + global.gameID);

		eventSource.onmessage = async ({ data }) => {
			const json = await JSON.parse(data)
			setGame(json.game)
		}
		window.addEventListener('keydown',keyDown, true);
		window.addEventListener('keyup', keyUp, true);
		return () => {
			window.removeEventListener('keydown', keyDown, true)
			window.removeEventListener('keyup', keyUp, true)
			eventSource.close()
		};
	}, []);

	useEffect(() => {
		const resizeObserver = new ResizeObserver((event) => {
			setWidth(event[0].contentBoxSize[0].inlineSize * 0.9);
			setHeight(event[0].contentBoxSize[0].inlineSize * 0.9 / (1.9));
		});
		resizeObserver.observe(document.getElementById("Game")!);
	})
	return (
		<div className="relative flex-1 justify-center" id="Game">
			<Canvas width={width} height={height} game={game} ratio={width / 1900}/>
		</div>
	)
}

export default Pong