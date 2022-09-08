// Hooks
import React from 'react'

// Components
import IconButton from '../commons/buttons/IconButton'
import ContactInfo from './ContactInfo'

// Assets
import defaultUserImage from '../../assets/images/default-user.png'
import {FiEye, FiMessageCircle, FiX, FiZap} from 'react-icons/fi'

import { useDispatch } from 'react-redux'
import { setCurrentConv } from '../../store/global/reducer';
import { spectateGame, challenged } from '../../context/socket'
import { useSelector } from 'react-redux';

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
	const global = useSelector((state: any) => state.global)
	
	return (
		<>
			{/* On click go to profile */}
			<div className='flex justify-between w-full h-[56px] rounded-[4px] bg-transparent hover:bg-slate-900 mb-[16px] transition-all duration-300 ease-in-out'>
				<ContactInfo contact={contact} userImage={userImage} challenge={global.challenged && global.challenged.id === contact.id ? true : false}/>
				
					{/* { if user is online rende challenge button, else render FiEye Button  } */}
					{/* { check if contact is online before showing ACCEPT DECLINE buttons} */}
					{global.challenged && global.challenged.id === contact.id ?
						<div className='flex items-center'>
							<IconButton color="green" icon={FiZap} onClick={() => {challenged("ACCEPT", global, contact.id)}}/>
							<IconButton color="red" icon={FiX} onClick={() => {challenged("DECLINE", global, contact.id)}}/>

						</div>
						:
						<div className='flex items-center'>
							{
								global.status !== status.InGame && contact.status === status.InGame &&
								<IconButton icon={FiEye} onClick={() => {spectateGame(global, global.id, contact.id)}}/>
							}
							{global.status !== status.InGame && (contact.status === status.Connected || contact.status === status.InQueue) &&
								<IconButton icon={FiZap}  
								onClick={() => {contact.status !== status.InGame && challenged("ASK", global, contact.id) }}/>
							}
							<IconButton icon={FiMessageCircle} onClick={() => dispatch(setCurrentConv({username:contact.username}))}/>
						</div>

					}
					
			</div>
		</>
	)
}

Contact.defaultProps = {
	username: 'username',
	userImage: defaultUserImage,
}

export default Contact