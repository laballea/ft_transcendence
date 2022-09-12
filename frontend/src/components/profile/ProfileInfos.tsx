import React from 'react'
import {useDispatch, useSelector } from 'react-redux';

// Components
import DefaultButtonPrimary from '../commons/buttons/DefaultButtonPrimary';
import { FiEye, FiMessageCircle, FiZap } from 'react-icons/fi';
import { useNavigate } from "react-router-dom";

// CSS
import '../../assets/fonts/fonts.css';

// Types
import { status } from '../../common/types';
import { setCurrentConv } from '../../store/global/reducer';
import { challenged, spectateGame } from '../../context/socket';

type ProfileInfosProps = {
	contact: {
		username:string,
		id:number,
		status:status,
		lvl:number,
		gameStats:any
		profilPic:string
	},
}

const ProfileInfos = ({contact} : ProfileInfosProps) => {
	const global = useSelector((state: any) => state.global)
	const dispatch = useDispatch()
	let navigate = useNavigate();
	let statusTag : JSX.Element;
	let actions : JSX.Element;
	if (contact.username === global.username) // Check if the profile infos gernetated are from loggedin user
	{
		statusTag = 
		<span className='text-purple-500'>You</span>
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
				{global.friends.find((friend:any) => friend.id === contact.id) !== undefined && <DefaultButtonPrimary cta='Challenge'  icon={FiZap} onClick={()=>{challenged("ASK", global, contact.id)}} />}
				<div className='w-4'></div>
				<DefaultButtonPrimary cta='Message'  icon={FiMessageCircle} onClick={()=>{dispatch(setCurrentConv({username:contact.username}))}} />
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
				<DefaultButtonPrimary cta='Watch'  icon={FiEye} onClick={()=>{navigate('/app');spectateGame(global, global.id, contact.id)}} />
				<div className='w-4'></div>
				<DefaultButtonPrimary cta='Message'  icon={FiMessageCircle} onClick={()=>{dispatch(setCurrentConv({username:contact.username}))}} />
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
				{global.friends.find((friend:any) => friend.id === contact.id) !== undefined && <DefaultButtonPrimary cta='Challenge'  icon={FiZap} onClick={()=>{challenged("ASK", global, contact.id)}} />}
				<div className='w-4'></div>
				<DefaultButtonPrimary cta='Message'  icon={FiMessageCircle} onClick={()=>{dispatch(setCurrentConv({username:contact.username}))}} />
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
				<DefaultButtonPrimary cta='Message'  icon={FiMessageCircle} onClick={()=>{dispatch(setCurrentConv({username:contact.username}))}} />
			</>
		}
	}

	return (
		<div className='flex items-center mb-[64px]'>
			<div 
							style={{backgroundImage:`url(${contact.profilPic})`}}
							className='w-[200px] h-[200px] rounded-full mr-[16px] bg-cover' >
						</div>
			
			<div className='relative'>
				<div className='absolute flex items-center justify-between gap-[8px] mt-[-8px] font-space w-full'>
					{statusTag}
					<p className='font-space text-slate-400'>lvl.{contact.lvl}</p>
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