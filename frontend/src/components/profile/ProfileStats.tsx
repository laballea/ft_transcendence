import React from 'react'

// Components

// CSS
import '../../assets/fonts/fonts.css';

// Hooks

// Types
import { status } from '../../common/types';

type ProfileStatsProps = {
	contact: {
		username:string,
		id:number,
		status:status,
		gameStats:any
	}
}

const totalTimePlayed = (gameStats:any):number => {
	let totalms = gameStats.reduce((accumulator:any, object:any) => {
		return accumulator + object.duration;
	}, 0)
	return (totalms / 1000 / 60)
}

const victoryprct = (gameStats:any, userId:number):number => {
	let totalWin = gameStats.reduce((accumulator:any, object:any) => {
		if (object.winner === userId)
			return accumulator + 1
		else
			return accumulator
	}, 0)
	return totalWin * 100 / gameStats.length
}

const maxBallSpeed = (gameStats:any):string => {
	let maxSpeed = gameStats.reduce((accumulator:any, object:any) => {
		if (object.maxSpeed > accumulator)
			return object.maxSpeed
		else
			return accumulator
	}, 0)
	return (maxSpeed * 0.00026 / 0.025).toFixed(2)
}

const ProfileStats = ({contact} : ProfileStatsProps) => {

	return (
		<div  className='w-full border-t-2 border-slate-700'>
			<h2 className='font-pilowlava text-[64px] text-transparent backgroundTextOutline'>Stats</h2>
			{ contact.gameStats.length === 0 ?
				<p className="text-slat">{contact.username}: No Games played yet</p>
				:
				<div>
					<p className="text-slat">Game played: {contact.gameStats.length}</p>
					<p className="text-slat">Total time played: {Math.round(totalTimePlayed(contact.gameStats))}min</p>
					<p className="text-slat">Average game duration: {Math.round(totalTimePlayed(contact.gameStats) / contact.gameStats.length)}min</p>
					<p className="text-slat">% Victory: {victoryprct(contact.gameStats, contact.id)}%</p>
					<p className="text-slat">Ball maximum speed: {maxBallSpeed(contact.gameStats)}m/s</p>

				</div>
			}
		</div>
	)
}

export default ProfileStats