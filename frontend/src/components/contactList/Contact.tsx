// Hooks
import React from 'react'

// Components
import IconButton from '../commons/buttons/IconButton'
import ContactInfo from './ContactInfo'

// Assets
import defaultUserImage from '../../assets/images/default-user.png'
import {FiEye, FiMessageCircle} from 'react-icons/fi'

import { useDispatch } from 'react-redux'
import { setCurrentConv } from '../../store/global/reducer';

// Types
import { status } from '../../common/types';

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
				<ContactInfo Contact={contact} userImage={userImage}/>
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