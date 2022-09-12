// Hooks
import React from 'react'

// Assets
import defaultUserImage from '../../assets/images/default-user.png'
import { truncateString } from '../commons/utils/truncateString';

type FriendRequestOutProps = {
	username: string,
}

const FriendRequestOut = ({username} : FriendRequestOutProps) => {

	// Get user image: 
	let userImage: string = defaultUserImage;

	return (
		<>
			{/* On click go to profile */}
			<div className='flex justify-between w-full h-[56px] rounded-[4px] bg-transparent mb-[16px] border-transparent border opacity-50'>
				<div className='flex items-center w-full h-full'>
					{/* Fetch image */}
					
					<div className="border-2 border-transparent rounded-full ml-[8px]">
					<div 
						style={{backgroundImage:`url(${userImage})`}}
						className='w-[40px] h-[40px] rounded-full' >
					</div>
					</div>
					<div className="ml-[16px]">
						<p className='absolute mt-[-8px] text-slate-400 font-space text-[10px]'>Request Sent</p>
						<p className='font-space text-slate-400 text-[20px]'>
							{truncateString(username, 15)}
						</p>
					</div>
				</div>
			</div>

		</>
	)
}

FriendRequestOut.defaultProps = {
	username: 'username',
}

export default FriendRequestOut