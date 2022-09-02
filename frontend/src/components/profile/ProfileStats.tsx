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
			{ contact.gameStats.length == 0 ?
				<p className="font-space text-slate-400 text-[12px]">{"No Games played yet :("}</p>
				:
				<div>
					<div className='flex items-center'>
						<div className='inline-block'>
							<p className="font-space text-slate-500">
								Game played:
							</p>
						</div>
						<div className='grow mr-[8px] ml-[8px] h-[1px] bg-slate-700'></div>
						<div className='inline-block'>
							<p className="font-space text-slate-300 mb-[8px]">
								{contact.gameStats.length}
							</p>
						</div>
					</div>
					<div className='flex items-center'>
						<div className='inline-block'>
							<p className="font-space text-slate-500">
								Total time played:
							</p>
						</div>
						<div className='grow mr-[8px] ml-[8px] h-[1px] bg-slate-700'></div>
						<div className='inline-block'>
							<p className="font-space text-slate-300 mb-[8px]">
								{Math.round(totalTimePlayed(contact.gameStats))} min
							</p>
						</div>
					</div>
					<div className='flex items-center'>
						<div className='inline-block'>
							<p className="font-space text-slate-500">
								Average game duration:
							</p>
						</div>
						<div className='grow mr-[8px] ml-[8px] h-[1px] bg-slate-700'></div>
						<div className='inline-block'>
							<p className="font-space text-slate-300 mb-[8px]">
								{Math.round(totalTimePlayed(contact.gameStats) / contact.gameStats.length)} min
							</p>
						</div>
					</div>
					<div className='flex items-center'>
						<div className='inline-block'>
							<p className="font-space text-slate-500">
								% Victory:
							</p>
						</div>
						<div className='grow mr-[8px] ml-[8px] h-[1px] bg-slate-700'></div>
						<div className='inline-block'>
							<p className="font-space text-slate-300 mb-[8px]">
								{victoryprct(contact.gameStats, contact.id)} %
							</p>
						</div>
					</div>
					<div className='flex items-center'>
						<div className='inline-block'>
							<p className="font-space text-slate-500">
								Ball maximum speed:
							</p>
						</div>
						<div className='grow mr-[8px] ml-[8px] h-[1px] bg-slate-700'></div>
						<div className='inline-block'>
							<p className="font-space text-slate-300 mb-[8px]">
								{maxBallSpeed(contact.gameStats)} m/s
							</p>
						</div>
					</div>

				</div>
			}
		</div>
	)
}

export default ProfileStats