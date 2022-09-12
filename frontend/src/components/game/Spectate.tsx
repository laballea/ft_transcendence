// Components

// Hooks
import React, {useState, useEffect, useRef} from 'react'
import { useSelector } from 'react-redux'
import { GAME_STATUS } from '../../common/types';

//
import Canvas from './Canvas';

const Spectate = () => {
	const global = useSelector((state: any) => state.global)
	const [game, setGame] = useState(null)
	const [width, setWidth] = useState(100);
	const [height, setHeight] = useState(100);

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
		return () => {

		};
		// eslint-disable-next-line
	}, []);

	const overlayEl = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const resizeObserver = new ResizeObserver((event) => {
			if (overlayEl.current != null) {
					let width = overlayEl.current.clientHeight * 1.9 > (window.innerWidth - 400) ? window.innerWidth - 400 : overlayEl.current.clientHeight * 1.9;
					let height = overlayEl.current.clientHeight * 1.9 > (window.innerWidth - 400) ? (window.innerWidth - 400)/ 1.9 : overlayEl.current.clientHeight;
					setWidth(width);
					setHeight(height);
				}
		});
		resizeObserver.observe(document.getElementById("GameDiv")!);
	})
	return (
		<div ref={overlayEl} className="relative flex-1 h-full justify-center
										animate-slidein" id="GameDiv">
			{game != null && <Canvas width={width} height={height} game={game} username={global.username} ratio={width / 1900}/>}
		</div>
	)
}

export default Spectate