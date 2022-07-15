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
		<div className="relative flex-1 justify-center">
			{global.status === status.InGame && <Pong/>}
			{global.status === status.InQueue && <Waiting/>}
			{global.status === status.Spectate && <Spectate/>}
		</div>
	)
}

export default Game