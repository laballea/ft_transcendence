// Hooks
import React from 'react'

// Components
import IconButton from '../commons/buttons/IconButton'

// Assets
import defaultUserImage from '../../assets/images/default-user.png'
import {FiEye, FiMessageCircle} from 'react-icons/fi'

import { useDispatch } from 'react-redux'
import { status } from '../../common/types';
import { setCurrentConv } from '../../store/global/reducer';

type ContactProps = {
	contact: {
		username:string,
		id:number,
		status:status,
		
	},
	userImage:string
}

const Contact = ({contact, userImage} : ContactProps) => {
	const dispatch = useDispatch()
	
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
						<p className='absolute mt-[-8px] text-slate-400 font-space text-[10px]'>{contact.status}</p>
						<p className='font-space text-slate-400 text-[20px]'>
							{contact.username}
						</p>
					</div>
				</div>
				<div className='flex items-center'>
					{/* { if user is online rende challenge buttong, else render FiEye Button  } */}
					<IconButton icon={FiEye} />
					<IconButton icon={FiMessageCircle} onClick={() => dispatch(setCurrentConv({username:contact.username}))}/>
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