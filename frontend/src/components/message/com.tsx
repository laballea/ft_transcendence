import React, { useState, useContext, useEffect } from "react";
import { IState as Props } from "./index";
import { io, Socket } from 'socket.io-client'
import { useSelector } from 'react-redux'
import { SocketContext } from '../../context/socket';

interface IProps {
	msg: Props["msg"]
	setMessage: React.Dispatch<React.SetStateAction<Props["msg"]>>
}

const Com: React.FC<IProps> = ({ msg, setMessage }) => {
	const socket = useContext(SocketContext);

	const [input, setInput] = useState({
		content: ""
	})

	const global = useSelector((state: any) => state.global)

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
		setInput({
			...input,
			[e.target.name]: e.target.value
		})
	}

	const sendMessage = (): void => {
		socket.emit('dmServer', {
			content: input.content,
			client_emit: global.username,
			client_recv: global.clientChat,
			jwt:global.token
		});
		setInput({
			content: ""
		})
	}

	useEffect(() => {
		socket.on('dmClient', (sender: string, message: string, delta: string) => {
			setMessage([
				...msg,
				{
					author: sender,
					content: message,
					date: delta,
				}
			]);
		})
	}, []);

	return (
		<div className="Com">
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
				style={{color: "white"}}
			>
				Send
			</button>
		</div>
	)
}

export default Com;