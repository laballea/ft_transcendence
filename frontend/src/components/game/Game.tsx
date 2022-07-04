// Components

// Hooks
import React from 'react'
import { useSelector } from 'react-redux'
import { status } from '../../common/types';

import Pong from './Pong';

const Game = () => {
	const global = useSelector((state: any) => state.global)

	return (
		<div className="relative flex-1 justify-center">
			{global.status === status.InGame && <Pong/>}
			{global.status === status.InQueue && <p>searching for players</p>}
		</div>
	)
}

export default Game