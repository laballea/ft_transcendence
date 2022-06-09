import React, { useState, useContext, useEffect } from "react";
import { io, Socket } from 'socket.io-client'
import { useSelector } from 'react-redux'
import { SocketContext } from '../../context/socket';

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
		console.log(global.clientChat)
		socket.emit('dmServer', {
			content: input.content,
			client_send: global.username,
			client_recv: global.clientChat,
			conversationID: conv.id,
			jwt:global.token
		});
		setInput({
			content: ""
		})
	}

	return (
		<div className="Com">
			<input
				className="add-chat"
				type="text"
				placeholder="write here..."
				value={input.content}
				onChange={handleChange}
				name="content"
				style={{marginLeft: '200px', paddingLeft: '100px'}}
			/>
			<button
				className="add-chat"
				onClick={sendMessage}
				style={{color:'white', padding: '100px'}}
			>
				Send
			</button>
		</div>
	)
}

export default Com;