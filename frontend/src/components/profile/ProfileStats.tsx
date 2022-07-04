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
		
	}
}

const ProfileStats = ({contact} : ProfileStatsProps) => {
	
	return (
		<div  className='w-full border-t-2 border-slate-700'>
			<h2 className='font-pilowlava text-[64px] text-transparent backgroundTextOutline'>Stats</h2>
			<p className="text-slat">{contact.username}: No Games played yet</p>
		</div>
	)
}

export default ProfileStats