// Hooks
import React from 'react'

// Components
import IconButton from '../commons/buttons/IconButton'

// Assets
import defaultUserImage from '../../assets/images/default-user.png'
import {FiCheck, FiX} from 'react-icons/fi'

import { acceptFriendRequest, declineFriendRequest } from '../../context/socket';
import { useSelector } from 'react-redux'

type FriendRequestInProps = {
	username: string,
}

const FriendRequestIn = ({username} :  FriendRequestInProps) => {

	// Get user image: 
	let userImage: string = defaultUserImage;
	const global = useSelector((state: any) => state.global)

	return (
		<>
			{/* On click go to profile */}
			<div className='flex justify-between w-full h-[56px] rounded-[4px] bg-green-700/20 mb-[16px] border-green-500 border'>
				<div className='flex items-center w-full h-full'>
					{/* Fetch image */}
					
					<div className="border-2 border-green-500 rounded-full ml-[8px]">
						<img src={userImage} width="40" height="40" alt="userimage" className='rounded-full'></img>
					</div>
					<div className="ml-[16px]">
						<p className='absolute mt-[-8px] text-green-500 font-space text-[10px]'>added You</p>
						<p className='font-space text-green-500 text-[20px]'>
							{username}
						</p>
					</div>
				</div>
				<div className='flex items-center'>
					<IconButton icon={FiCheck}	color='green'	onClick={()=>acceptFriendRequest(global,username)}/>
					<IconButton icon={FiX}		color='red'		onClick={()=>declineFriendRequest(global,username)}/>
				</div>
			</div>

		</>
	)
}

FriendRequestIn.defaultProps = {
	username: 'username',
}

export default FriendRequestIn