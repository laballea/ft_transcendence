// Hooks
import React, {useState} from 'react'

// Components
import IconButton from '../commons/buttons/IconButton'

// Assets
import defaultUserImage from '../../assets/images/default-user.png'
import {FiEye, FiLock, FiMessageCircle} from 'react-icons/fi'

type ContactProps = {
	username: string,
	userImage: string,
}

const Contact = ({username, userImage} : ContactProps) => {
	
	return (
		<>
			{/* On click go to profile */}
			<div className='flex justify-between w-full h-[56px] rounded-[4px] bg-transparent hover:bg-slate-900 mb-[16px]'>
				<div className='flex items-center w-full h-full'>
					{/* Fetch image */}
					<div className="border-2 border-transparent rounded-full ml-[8px]">
						<img src={userImage} width="40" height="40" alt="userimage" className='rounded-full'></img>
					</div>
					<div className="ml-[16px]">
						<p className='absolute mt-[-8px] text-slate-400 font-space text-[10px]'>Current Status</p>
						<p className='font-space text-slate-400 text-[20px]'>
							{username}
						</p>
					</div>
				</div>
				<div className='flex items-center'>
					{/* { if user is online rende challenge buttong, else render FiEye Button  } */}
					<IconButton icon={FiEye}/>
					<IconButton icon={FiMessageCircle}/>
				</div>
			</div>

		</>
	)
}

Contact.defaultProps = {
	username: 'username',
	userImage: defaultUserImage,
}

export default Contact