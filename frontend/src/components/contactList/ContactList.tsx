// Components
import EmptyStateContactList from './EmptyStateContactList';
import AddFriendButton from '../commons/buttons/AddFriendButton';
import Contact from './Contact'
import FriendRequestIn from './FriendRequestIn'
import FriendRequestOut from './FriendRequestOut'


// Hooks
import React, {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'

// SocketIo
import { setContactList, setSearchUserContactList } from '../../store/global/reducer';
import Loading from '../commons/utils/Loading';

const ContactList = () => { 
	const global = useSelector((state: any) => state.global)
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(true)

	const getContact = () => {
		const requestOptions = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
				'Access-Control-Allow-Origin': '*',
				'Authorization': 'bearer ' + global.token,
			},
		}
		fetch(`http://${process.env.REACT_APP_ip}:5000/users/contactList?searchUsername=${global.searchUserContactList}&id=${global.id}`, requestOptions)
		.then(async resp=>{
			let json = await resp.json();
			dispatch(setContactList(json.sort((a:any, b:any) => Number(b.friend) - Number(a.friend))))
			setLoading(false)
		})
	}

	useEffect(() => {
		setLoading(true)
		let inter = setInterval(getContact, 1000);
		return () => {
			clearInterval(inter)
		};
		// eslint-disable-next-line
	}, [global.searchUserContactList]);

	const friendsRequestList = global.friendsRequest.length > 0 ? global.friendsRequest.map((user: {id:number, username:string}, index:number) =>  <FriendRequestIn key={index} username={user.username}/>): [];
	const friendsList = global.contactList.length > 0 ? global.contactList.map((contact: any, index:number) =>  <Contact index={index} key={index} contact={contact} userImage={contact.profilPic}/>): [];
	const pendingRequest = global.pendingRequest.length > 0 ? global.pendingRequest.map((contact: any, index:number) =>  <FriendRequestOut key={index} username={contact.username}/>): [];
	return (
		<div className="relative w-full bg-slate-800 sm:w-[400px] p-[16px] mx-[16px] sm:mx-0 rounded sm:rounded-l ">
			<AddFriendButton cta="search.." value={global.searchUserContactList} onClick={(username:string)=> dispatch(setSearchUserContactList(username))}/>
			<div className="relative w-full  mt-[60px]">
				{
					!loading ?
					friendsRequestList.length > 0 || global.contactList.length > 0 || pendingRequest.length > 0 ?
						<div className='relative overflow-scroll'>
							{ friendsRequestList }
							{ friendsList }
							{ friendsList }
							{ pendingRequest }
						</div>
						:
						<EmptyStateContactList/>
					:
						<div className='flex items-center justify-center w-full h-full'>
							<Loading/>
						</div>
				}
			</div>
		</div>
	)
}

export default ContactList