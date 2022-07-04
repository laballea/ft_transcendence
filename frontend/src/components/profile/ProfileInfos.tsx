import React from 'react'
import {useSelector } from 'react-redux';

// Components
import DefaultButtonPrimary from '../commons/buttons/DefaultButtonPrimary';
import { FiEye, FiMessageCircle, FiZap } from 'react-icons/fi';

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
	const global = useSelector((state: any) => state.global)

	let statusTag : JSX.Element;
	let actions : JSX.Element;

	if (contact.username === global.username) // Check if the profile infos gernetated are from loggedin user
	{
		statusTag = 
		<span className='text-purple-500'>
				It's you!
		</span>
		actions = 
		<>
		</>
	}
	else
	{
		if (contact.status === status.Connected)
		{
			statusTag = 
			<span className='text-green-500'>
				{contact.status}
			</span>
			actions = 
			<>
				<DefaultButtonPrimary cta='Challenge'  icon={FiZap} onClick={()=>{}} />
				<div className='w-4'></div>
				<DefaultButtonPrimary cta='Message'  icon={FiMessageCircle} onClick={()=>{}} />
			</>
		}
		else if (contact.status === status.InGame)
		{
			statusTag = 
			<span className='text-yellow-500'>
				{contact.status}
			</span>
			actions = 
			<>
				<DefaultButtonPrimary cta='Watch'  icon={FiEye} onClick={()=>{}} />
				<div className='w-4'></div>
				<DefaultButtonPrimary cta='Message'  icon={FiMessageCircle} onClick={()=>{}} />
			</>
		}
		else if (contact.status === status.InQueue)
		{
			statusTag = 
			<span className='text-yellow-500'>
				{contact.status}
			</span>
			actions = 
			<>
				<DefaultButtonPrimary cta='Challenge'  icon={FiZap} onClick={()=>{}} />
				<div className='w-4'></div>
				<DefaultButtonPrimary cta='Message'  icon={FiMessageCircle} onClick={()=>{}} />
			</>
		}
		else // (contact.status === status.Disconnected)
		{
			statusTag = 
			<span className='text-yellow-500'>
				{contact.status}
			</span>
			actions = 
			<>
				<DefaultButtonPrimary cta='Message'  icon={FiMessageCircle} onClick={()=>{}} />
			</>
		}
	}

	return (
		<div className='flex items-center mb-[64px]'>
			<img src={userImage} width="200" height="200" alt="userimage" className="rounded-full mr-[16px]"></img>
			<div >
				<div className='absolute mt-[-8px] font-space'>
					{statusTag}
				</div>
				<h2 className='font-pilowlava text-[64px] text-slate-400'>{contact.username}</h2>
				<div className='flex align-center'>
					{ actions }
				</div>
			</div>
		</div>
	)
}


ProfileInfos.defaultProps = {
}


export default ProfileInfos