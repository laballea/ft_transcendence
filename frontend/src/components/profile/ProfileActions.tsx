import React from 'react'

// Hooks
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';

// Types
import { status } from '../../common/types';
import IconButton from '../commons/buttons/IconButton';
import { FiSlash, FiUserCheck, FiUserPlus } from 'react-icons/fi';
import { addFriend, blocked, removeFriend } from '../../context/socket';

// Components


type ProfileActionsProps = {
	contact: {
		username:string,
		id:number,
		status:status,
		gameStats:any,
	}
}

// eslint-disable-next-line
const ProfileActions = ({contact} : ProfileActionsProps) => {
	
	const global = useSelector((state: any) => state.global)
	const navigate = useNavigate();
	const backtext : string = "<- back";

	let actions : JSX.Element;

	if (contact.username === global.username)
	{
		actions = 
		<>
		</>
	}
	else
	{
		if (global.blocked.find((blocked:any) => blocked.id === contact.id) === undefined)
		{
			actions =
			<>
				{	
					global.friends.find((friend:any) => friend.id === contact.id) !== undefined ?
						<>
							<IconButton color='green' icon={FiUserCheck} onClick={() => removeFriend(global, contact.username)}></IconButton>
						</>
					:	<IconButton color='#e2e8f0' icon={FiUserPlus} onClick={() => addFriend(global, contact.username)}></IconButton>
				}
				<IconButton color='red' icon={FiSlash} onClick={() => blocked(global, contact.username)}></IconButton>
			</>
		}
		else
		{	
			actions = 
			<div className='flex items-center' onClick={() => blocked(global, contact.username)}>
				<IconButton color='red' icon={FiSlash} ></IconButton>
				<p className='text-[12px] font-space text-red-500'>Blocked </p>
			</div>
		}

	}

	return (
		<>
			<div className='flex items-center justify-self-stretch mb-3'>
				<button 
					className="font-space text-slate-400 hover:text-slate-300
								transition-all duration-300 ease-in-out"
					onClick={ () => navigate("/app") }> 
					{ backtext }
				</button>
				<div  className='grow border h-[2px] border-slate-700 mr-[8px] ml-[8px]'></div>
				{
					actions
				}
			</div>
		</>
	)
}


ProfileActions.defaultProps = {
}


export default ProfileActions