// Components

import EmptyStateContactList from './EmptyStateContactList';
import AddFriendButton from '../commons/buttons/AddFriendButton';
import { FiCheck, FiX} from "react-icons/fi";
// Hooks
import React, {useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { status } from '../../common/types';
import { sendFriendRequest, acceptFriend, ignoreFriend } from '../../store/global/reducer';

const ContactList = () => {
	const global = useSelector((state: any) => state.global)
	const [state, setState] = useState({contactList:[]})
	const dispatch = useDispatch()
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
		<div key={contact.username} style={{flex:1,display:"flex", backgroundColor:'red',flexDirection:"row", color:contact.status === status.Connected ? "#2CDA9D" : "#C41E3D"}}>
			<div style={{flex:3, padding:10}}>
				<p>{contact.username}</p>
			</div>
			<div style={{flex:1, padding:10}}>
				<button onClick={() => {dispatch(sendFriendRequest({friendID:contact.id}))}}>ADD</button>
			</div>
		</div>
	): [];
	const listFriendRequest = global.friendRequest.length > 0 ? global.friendRequest.map((contact: any) =>  
		<div key={contact.username} style={{flex:1,display:"flex",flexDirection:"row", color:contact.status === status.Connected ? "#2CDA9D" : "#C41E3D"}}>
			<div style={{flex:3, padding:10}}>
				<p>friend request from {contact.username}</p>
			</div>
			<div style={{flex:1, padding:10}}>
				<button
					onClick={() => {dispatch(acceptFriend())}}
				>
					<FiCheck/>
				</button>
				<button
					onClick={() => {dispatch(ignoreFriend())}}
				>
					<FiX/>
				</button>
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
					<div>
						{listItems}
						
					</div>
					:
					<EmptyStateContactList/>
				}
			</div>
		</div>
	)
}

export default ContactList