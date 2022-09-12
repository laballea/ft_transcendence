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
		if (global.gameID !== undefined)
			getgame()
		return () => {

		};
		// eslint-disable-next-line
	}, []);

	const overlayEl = useRef<HTMLDivElement>(null);
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
			{width > 500 ?
				<div className="relative w-full h-auto" >
					{game != null && <Canvas width={width} global={global} height={height} game={game} username={global.username} ratio={width / 1900}/>}
				</div>
				:
				<div className="relative w-full h-auto 
								font-pilowlava text-transparent backgroundTextOutline text-[32px]">
					<p>too small</p>
				</div>
			}
		</div>
	)
}

export default Spectate