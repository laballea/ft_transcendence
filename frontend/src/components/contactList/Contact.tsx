// Hooks
import React from 'react'

// Components
import IconButton from '../commons/buttons/IconButton'
import ContactInfo from './ContactInfo'

// Assets
import defaultUserImage from '../../assets/images/default-user.png'
import {FiCheck, FiEye, FiMessageCircle, FiX, FiZap} from 'react-icons/fi'

import { useDispatch } from 'react-redux'
import { setCurrentConv } from '../../store/global/reducer';
import { spectateGame, challenged } from '../../context/socket'
import { useSelector } from 'react-redux';

// Types
import { status } from '../../common/types';
import { useNavigate } from "react-router-dom";

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
	let navigate = useNavigate();
	const global = useSelector((state: any) => state.global)
	
	console.log('global.challenged' + global.challenged)
	
	return (
		<>
			{/* On click go to profile */}
			<div className='flex justify-between w-full h-[56px] rounded-[4px] bg-transparent hover:bg-slate-900 mb-[16px]'>
				<ContactInfo contact={contact} userImage={userImage} challenge={global.challenged ? true : false}/>
				
					{/* { if user is online rende challenge button, else render FiEye Button  } */}
					{/* { check if contact is online before showing ACCEPT DECLINE buttons} */}
					{global.challenged && global.challenged.id === contact.id ?
						<div className='flex items-center'>
							<p>Challenges you!</p>
							<IconButton icon={FiCheck} onClick={() => {challenged("ACCEPT", global, contact.id)}}/>
							<IconButton icon={FiX} onClick={() => {challenged("DECLINE", global, contact.id)}}/>
aw
						</div>
						:
						<div className='flex items-center'>
							<IconButton icon={FiEye} onClick={() => {navigate('/app/profile/' + contact.username, { state: {id:contact.id} })}}/>
							{global.status !== status.InGame && contact.status !== status.Disconnected &&
								<IconButton icon={FiZap} color={contact.status === status.InGame ? "red" : "green"} 
								onClick={() => {contact.status === status.InGame ? spectateGame(global, global.id, contact.id) : challenged("ASK", global, contact.id) }}/>
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