// Components

// Hooks
import React from 'react'
import { useSelector } from 'react-redux'
import { status } from '../../common/types';

import Pong from './Pong';
import Spectate from './Spectate';
import Waiting from './Waiting';

const Game = () => {
	const global = useSelector((state: any) => state.global)
	return (
		<div className="w-full h-full
						flex items-center justify-center
						bg-gradient-to-r
						from-purple-500/50
						via-slate-700/50
						to-purple-700/50 
						bg-[length:400%]
						animate-bgpanright">
			<div >
				{global.status === status.InQueue && <Waiting/>}
				{global.status === status.InGame && <Pong/>}
				{global.status === status.Spectate && <Spectate/>}
			</div>
		</div>
	)
}

export default Game