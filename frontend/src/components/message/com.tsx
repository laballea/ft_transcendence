import React, { useState, useContext } from "react";
import { FiArrowRight } from "react-icons/fi";
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

	const onlySpaces = (str : string) => {
		return str.trim().length === 0;
	  }

	const sendMessage = (event : any): void => {
		event.preventDefault();
		if (conv.adminId !== undefined) {
			socket.emit('roomMsg', {
				content: input.content,
				client_send: global.username,
				client_recv: global.clientChat,
				conversationID: conv.id,
				jwt:global.token
			})
		}
		else if(!onlySpaces(input.content)){
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
		<form onSubmit={sendMessage} className="flex gap-[8px] w-full items-center justify-between">
			<input
				className="	w-full
							grow
							p-[8px] pl-[12px] rounded-sm
							bg-slate-800 hover:bg-slate-900 focus:bg-slate-900 text-slate-200 placeholder:text-slate-400
							font-space text-[16px]
							transition-all duration-300 ease-in-out
							"
				type="text"
				placeholder="write here..."
				value={input.content}
				onChange={handleChange}
				name="content"
				autoComplete="off"
				required
			/>
			<button type="submit" className="flex items-center justify-center">
				<FiArrowRight className="sm:w-[24px] w-[16px] sm:h-[24px] h-[16px]" />
			</button>
		</form>
	)
}

export default Com;