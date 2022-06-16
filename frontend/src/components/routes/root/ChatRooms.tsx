import React, { useState, useContext, useEffect } from "react";
import { useSelector } from 'react-redux'
import { socket } from "../../../context/socket";

const ChatRooms = () => {
	const [form, createRoom] = React.useState(false);
	const global = useSelector((state: any) => state.global)

	const [input, setInput] = useState({
		roomName: "",
		password: "",
		confirmed: "",
	})

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
		setInput({
			...input,
			[e.target.name]: e.target.value
		})
	}

	const pushRoom = ():void => {
		console.log('push room')
		if (input.password != input.confirmed)
			alert("password does not match !")
		else {
			socket.emit('newChatRoom', {
				name: input.roomName,
				password: input.password,
				admin: global.username,
			});
			// createRoom(!form);
		}
		setInput({
			roomName: "",
			password: "",
			confirmed: "",
		})
	}

	return (
		
		<div>
			<button
				className="add-chat"
				onClick={() => createRoom(!form)}
				style={{color:'white', marginLeft: '25px'}}
			>
				Create Room +
			</button>
			{
				form ?
					<form>
						<input
							type="text"
							placeholder="room"
							value={input.roomName}
							onChange={handleChange}
							name="roomName"
							required
						/>
						<input
							type="password"
							placeholder="password"
							value={input.password}
							onChange={handleChange}
							name="password"
							required
						/>
						<input
							type="password"
							placeholder="confirm password"
							value={input.confirmed}
							onChange={handleChange}
							name="confirmed"
							required
						/>
						<button
							onClick={pushRoom}
							style={{color:'white', marginLeft: '25px'}}
						>
							Create
						</button>
					</form>
					: 
					null
			}
		</div>
	)
}

export default ChatRooms;
