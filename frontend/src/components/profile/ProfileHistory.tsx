import React from 'react'
// Components
import getProfilImg from '../commons/utils/getProfilImg';
// CSS
import '../../assets/fonts/fonts.css';

// Hooks

// Types
import { status } from '../../common/types';

type ProfileHistoryProps = {
	contact: {
		username:string,
		id:number,
		status:status,
		gameStats:any
	}
}

const ProfileHistory = ({contact} : ProfileHistoryProps) => {

	console.log(contact)

	const gamesList = contact.gameStats.length > 0 ? contact.gameStats.map((games:any, index:number) =>
		<div key={index}>
			<div className='flex items-center text-slate-500 font-pilowlava text-[22px]'>
				<div className='w-[40px] mr-[8px]'>
				{
					games.winner === contact.id	?	<p className='font-pilowlava text-[32px] text-green-500'>W</p> 
												:	<p className='font-pilowlava text-[32px] text-red-500'>L</p>
				}
				</div>
				<div className='flex items-center justify-left gap-[8px]'>
					<div className='w-[32px]'>
						<img src={
								getProfilImg(games.users.find((user:any) => user.id === games.winner).profilPic)
							} 
							width="32" height="32" alt="userimage" className="rounded-full mr-[16px]">	
						</img>
					</div>
					<p className='w-[144px] font-space text-[16px]'>
						{games.users.find((user:any) => user.id === games.winner).username}
					</p>
				</div>
				<div className='flex items-center justify-center'>
					<p className='w-[24px] flex items-center justify-center'>
						{games.score[0] > games.score[1] ? games.score[0] : games.score[1]}
					</p>
					<p>
						-
					</p>
					<p className='w-[24px] flex items-center justify-center'>
						{games.score[0] > games.score[1] ? games.score[1] : games.score[0]}
					</p>
				</div>
				<div className='flex items-center justify-end gap-[8px]'>
					<p className='w-[144px] font-space text-[16px] text-right'>
						{games.users.find((user:any) => user.id !== games.winner).username}
					</p>
					<div className='w-[32px]'>
						<img src={
								getProfilImg(games.users.find((user:any) => user.id !== games.winner).profilPic)
							} 
							width="32" height="32" alt="userimage" className="rounded-full mr-[16px]">	
						</img>
					</div>
				</div>
			</div>
			{
				contact.gameStats.length !== index + 1 ? <div  className='w-full border-t-[1px] border-slate-700 mb-[4px]'></div> : []
			}
		</div>
	): [];

	return (
		<div  className='w-full border-t-2 border-slate-700 mb-[56px]'>
			<h2 className='font-pilowlava text-[64px] text-transparent backgroundTextOutline'>History</h2>
			{ contact.gameStats.length === 0 ?
				<p className="font-space text-slate-400 text-[12px]">{"No Games played yet :("}</p>
				:
				<div>
					{gamesList}
				</div>
			}
		</div>
	)
}

export default ProfileHistory