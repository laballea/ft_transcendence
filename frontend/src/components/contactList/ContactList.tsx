import React from 'react'

// Components
import LoadingSpinner from '../commons/utils/loadingSpinner';
import EmptyStateContactList from './EmptyStateContactList';
import AddFriendButton from '../commons/buttons/AddFriendButton';

// Hooks
import {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import { status } from '../../common/types';

const ContactList = () => {
	const global = useSelector((state: any) => state.global)
	const [state, setState] = useState({contactList:[]})

	var eventSource:EventSource;
	useEffect(() => {
		// eslint-disable-next-line
		eventSource = new EventSource('http://localhost:5000/users/contactList?username=' + global.username);
		eventSource.onmessage = ({ data }) => {
			const json = JSON.parse(data)
			setState(prevState => ({
				...prevState,
				contactList: json.contactList
			}));}
	}, []);
	const listItems = state.contactList.length > 0 ? state.contactList.map((contact: any) =>  
		<div className='contactItem' key={contact.username} style={{color:contact.status === status.Connected ? "#2CDA9D" : "#C41E3D"}}>
			<div style={{flex:3,justifyContent:'left', padding:10}}>
				{contact.username}
			</div>
			<div style={{flex:1, padding:10}}>
				<button>ADD</button>
			</div>
		</div>
	): [];
	
	return (
		<div className="relative w-full bg-slate-800 sm:w-[400px] h-full p-[16px] mx-[16px] sm:mx-0 rounded sm:rounded-l overflow-scroll">
			<AddFriendButton/>
			<div className="h-full">
				{
					state.contactList.length > 0 
					?
					listItems
					:
					<EmptyStateContactList/>
				}
			</div>
		</div>
	)
}

export default ContactList