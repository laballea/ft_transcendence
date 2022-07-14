// Hooks
import React from 'react'

// Components
import IconButton from '../commons/buttons/IconButton'
import ContactInfo from './ContactInfo'

// Assets
import defaultUserImage from '../../assets/images/default-user.png'
import {FiEye, FiMessageCircle, FiZap} from 'react-icons/fi'

import { useDispatch } from 'react-redux'
import { setCurrentConv } from '../../store/global/reducer';
import { spectateGame, sendGameRequest } from '../../context/socket'
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

	return (
		<>
			{/* On click go to profile */}
			<div className='flex justify-between w-full h-[56px] rounded-[4px] bg-transparent hover:bg-slate-900 mb-[16px]'>
				<ContactInfo contact={contact} userImage={userImage}/>
				<div className='flex items-center'>
					{/* { if user is online rende challenge buttong, else render FiEye Button  } */}
					<IconButton icon={FiEye} onClick={() => {navigate('/app/profile/' + contact.username, { state: {id:contact.id} })}}/>
					{global.status !== status.InGame && contact.status !== status.Disconnected &&
						<IconButton icon={FiZap} color={contact.status === status.Connected ? "green" : "red"} 
						onClick={() => {contact.status === status.Connected ? sendGameRequest(global, contact.username) : spectateGame(global, global.id, contact.id)}}/>
					}
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