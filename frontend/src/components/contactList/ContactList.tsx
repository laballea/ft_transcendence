// Components

import EmptyStateContactList from './EmptyStateContactList';
import AddFriendButton from '../commons/buttons/AddFriendButton';
import { FiCheck, FiX} from "react-icons/fi";

// Hooks
import React, {useState, useEffect, useContext} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FRIEND_REQUEST_ACTIONS, status } from '../../common/types';

//
import { SocketContext } from '../../context/socket';
import { setCurrentConv } from '../../store/global/reducer';

const ContactList = () => {
	const global = useSelector((state: any) => state.global)
	const [state, setState] = useState({contactList:[]})
	const socket = useContext(SocketContext);
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
			}))}
		return () => {
			eventSource.close()
		};
	}, []);
	const friendsList = state.contactList.length > 0 ? state.contactList.map((contact: any) =>  
		<div key={contact.username} style={{flex:1, overflow:"hidden",display:"flex",flexDirection:"row", color:contact.status !== status.Disconnected ? "#2CDA9D" : "#C41E3D"}}>
			<p>
				<button
					onClick={() => {
						dispatch(setCurrentConv({username:contact.username}))
					}}
				>
					{contact.username}
				</button>
				<button
					onClick={() => {
						socket.emit("FRIEND_REQUEST", {
							action: FRIEND_REQUEST_ACTIONS.REMOVE,
							client_send: global.username,
							client_recv: contact.username,
							jwt:global.token
						})
					}}
				>
					<FiX style={ {color: "#C41E3D", fontSize: "1.5em"} }/>
				</button>
			</p>
		</div>
	): [];
	const friendsRequestList = global.friendsRequest.length > 0 ? global.friendsRequest.map((user: {id:number, username:string}) =>  
		<div className="bg-slate-700" key={user.id} style={{flex:1,display:"flex",flexDirection:"row", justifyContent:"center", alignItems:"center"}}>
			<div style={{flex:3, padding:10, color:"#2CDA9D"}}>
				<p>{user.username}</p>
			</div>
			<div style={{flex:1, padding:10, justifyContent:"center", alignItems:"center"}}>
				<button
					onClick={() => {
						socket.emit("FRIEND_REQUEST", {
							action: FRIEND_REQUEST_ACTIONS.ACCEPT,
							client_send: global.username,
							client_recv: user.username,
							jwt:global.token
						})
					}}
				>
					<FiCheck style={ {color: "#2CDA9D", fontSize: "1.5em"} }/>
				</button>
				<button
					onClick={() => {
						socket.emit("FRIEND_REQUEST", {
							action: FRIEND_REQUEST_ACTIONS.DECLINE,
							client_send: global.username,
							client_recv: user.username,
							jwt:global.token
						})
					}}
				>
					<FiX style={ {color: "#C41E3D", fontSize: "1.5em"} }/>
				</button>
			</div>
		</div>
	): [];
	return (
		<div className="relative overflow-scroll flex-initial w-full bg-slate-800 sm:w-[400px] flex-1 p-[16px] mx-[16px] sm:mx-0 rounded sm:rounded-l ">
			<AddFriendButton onSubmit={(username:string)=>{
				socket.emit("FRIEND_REQUEST", {
					action: FRIEND_REQUEST_ACTIONS.ADD,
					client_send: global.username,
					client_recv: username,
					jwt:global.token
				})}}
			/>
			<div className="relative w-full h-full mt-[60px]">
				{friendsRequestList}
				{
					state.contactList.length > 0 
					?
					<div>
						{friendsList}
					</div>
					:
					<EmptyStateContactList/>
				}
			</div>
		</div>
	)
}

export default ContactList