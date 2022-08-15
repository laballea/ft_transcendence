// Components
import EmptyStateContactList from './EmptyStateContactList';
import AddFriendButton from '../commons/buttons/AddFriendButton';
import Contact from './Contact'
import FriendRequestIn from './FriendRequestIn'
import FriendRequestOut from './FriendRequestOut'


// Hooks
import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'

// SocketIo
import { addFriend } from '../../context/socket';
import { setContactList } from '../../store/global/reducer';

const ContactList = () => { 
	const global = useSelector((state: any) => state.global)
	const dispatch = useDispatch()
	var eventSource:EventSource;

	// Getting Contact List
	useEffect(() => {
		// eslint-disable-next-line
		eventSource = new EventSource('http://localhost:5000/users/contactList?username=' + global.username);
		
		eventSource.onmessage = ({ data }) => {
			const json = JSON.parse(data)
			dispatch(setContactList(json.contactList))
			}
		return () => {
			eventSource.close()
		};
	}, []);
	const friendsRequestList = global.friendsRequest.length > 0 ? global.friendsRequest.map((user: {id:number, username:string}, index:number) =>  <FriendRequestIn key={index} username={user.username}/>): [];
	const friendsList = global.contactList.length > 0 ? global.contactList.map((contact: any, index:number) =>  <Contact key={index} contact={contact}/>): [];
	const pendingRequest = global.pendingRequest.length > 0 ? global.pendingRequest.map((contact: any, index:number) =>  <FriendRequestOut key={index} username={contact.username}/>): [];
	return (
		<div className="relative overflow-scroll w-full bg-slate-800 sm:w-[400px] flex-1 p-[16px] mx-[16px] sm:mx-0 rounded sm:rounded-l ">
			<AddFriendButton onSubmit={(username:string)=> addFriend(global, username)}/>
			<div className="relative w-full h-full mt-[60px]">
				{
					friendsRequestList.length > 0 || global.contactList.length > 0 || pendingRequest.length > 0 
					?
					<div>
						{ friendsRequestList }
						{ friendsList }
						{ pendingRequest }
					</div>
					:
					<EmptyStateContactList/>
				}
			</div>
		</div>
	)
}

export default ContactList