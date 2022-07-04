import React, { useState, useContext } from "react";
import { useSelector } from 'react-redux'
import { SocketContext } from '../../context/socket';
import Room from "../room";

interface IProps {
	conv: any
}

const Com: React.FC<IProps> = ({ conv }) => {
	const socket = useContext(SocketContext);
	const global = useSelector((state: any) => state.global)

	const [input, setInput] = useState({
		content: ""
	})

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
		setInput({
			...input,
			[e.target.name]: e.target.value
		})
	}

	const sendMessage = (): void => {
		console.log("Send msg")
		if (conv.adminId != undefined) {
			socket.emit('roomMsg', {
				content: input.content,
				client_send: global.username,
				client_recv: global.clientChat,
				conversationID: conv.id,
				jwt:global.token
			})
		}
		else {
			socket.emit('dmServer', {
				content: input.content,
				client_send: global.username,
				client_recv: global.clientChat,
				conversationID: conv.id,
				jwt:global.token
			});
		}
		setInput({
			content: ""
		})
	}

	return (
		<div className="Com" style={{marginLeft:10}}>
			<input
				className="add-chat"
				type="text"
				placeholder="write here..."
				value={input.content}
				onChange={handleChange}
				name="content"
				
			/>
			<button
				className="add-chat"
				onClick={sendMessage}
				style={{color:'white', marginLeft: '25px'}}
			>
				Send
			</button>
		</div>
	)
}

export default Com;