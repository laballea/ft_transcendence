import React from 'react'

// CSS
import '../../assets/fonts/fonts.css';

// Types
import { status } from '../../common/types';

type ProfileInfosProps = {
	contact: {
		username:string,
		id:number,
		status:status,
	},
	userImage:string
}

const ProfileInfos = ({contact, userImage} : ProfileInfosProps) => {
	
	return (
		<div className='flex items-center mb-[64px]'>
			<img src={userImage} width="200" height="200" alt="userimage" className="rounded-full mr-[16px]"></img>
			<div >
				<h2 className='font-bold bold text-[64px] text-slate-400'>{contact.username}</h2>
			</div>
		</div>
	)
}


ProfileInfos.defaultProps = {
}


export default ProfileInfos