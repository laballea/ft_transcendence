import React, {useState} from 'react';
import Chat from '../message/chat'
import Com from '../message/com'
import { useSelector } from 'react-redux'
import { socket } from "../../context/socket";
import Member from './member';

export interface MessageI {
		author: string
		content: string
		date: string
	
}

function Room() {
	const global = useSelector((state: any) => state.global)
	const room = global.roomID == -1 ? 
				{
					id:-1,
					msg:[],
					name:global.clientChat,
					users:[{username:global.clientChat}]
				}
				:
				global.room.find((room:any) => room.id == global.roomID)

	const [input, setInput] = useState({
		member: "",
	})

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
		setInput({
			...input,
			[e.target.name]: e.target.value
		})
	}

	const addMember = () => {
		console.log('add member', room.id, input.member, global.username)
		socket.emit('addMember', {
			roomId: room.id,
			user: input.member,
			admin: global.username,
		});
		setInput({
			member: "",
		})
	}

	const deleteRoom = () => {
		console.log('delete room', room.id, global.username)
		socket.emit('deleteRoom', {
			roomId: room.id,
			user: global.username,
		});
	}

	return (
		<div className="chat" style={{margin:50, width:400, height:500, display:'flex', flexDirection:'column', justifyContent:"center"}}>
			{/* <h3 style={{color:'white', flex:1}}>Chat /{room.users.length > 2 ? room.name : room.users.find((user:any) => user.username != global.username).username}</h3> */}
			<div>
				<input
					type="text"
					placeholder="member"
					value={input.member}
					onChange={handleChange}
					name="member"
				/>
				<button
					style={{color:'white'}}
					onClick={addMember}
				>
					Add member
				</button>
			</div>
			<div>
				<button
					onClick={deleteRoom}
				>
					Delete
				</button>
			</div>
			<div>
				<Member/>
			</div>
			<div style={{overflow:"hidden", overflowY:"scroll", flex:10}}>
				{/* <Chat msg={room.msg} username={global.username}/> */}
			</div>
			<div style={{flex:1}}>
				<Com conv={room} />
			</div>
		</div>
	)
}

export default Room;
