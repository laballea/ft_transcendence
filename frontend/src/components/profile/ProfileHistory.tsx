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

	const gamesList = contact.gameStats.length > 0 ? contact.gameStats.map((games:any, index:number) =>
		<div key={index} style={{display:'flex', flex:1, flexDirection:'row'}}>
			<p>{games.winner == contact.id ? "WIN" : "LOOSE"}</p>
			<div style={{display:'flex', flexDirection:'row', margin:5}}>
				<img src={getProfilImg(games.users.find((user:any) => user.id === games.winner).profilPic)} width="20" height="20" alt="userimage" className="rounded-full mr-[16px]"></img>
				<p>{games.score[0] > games.score[1] ? games.score[0] : games.score[1]}</p>
			</div>
			<p>-</p>
			<div style={{display:'flex', flexDirection:'row', margin:5}}>
				<p>{games.score[0] > games.score[1] ? games.score[1] : games.score[0]}</p>
				<img src={getProfilImg(games.users.find((user:any) => user.id !== games.winner).profilPic)} width="20" height="20" alt="userimage" className="rounded-full mr-[16px]"></img>
			</div>
		</div>
	): [];

	return (
		<div  className='w-full border-t-2 border-slate-700'>
			<h2 className='font-pilowlava text-[64px] text-transparent backgroundTextOutline'>History</h2>
			{ contact.gameStats.length == 0 ?
				<p className="text-slat">{contact.username}: No Games played yet</p>
				:
				<div>
					{gamesList}
				</div>
			}
		</div>
	)
}

export default ProfileHistory