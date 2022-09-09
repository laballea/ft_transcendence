import React from "react";
import { MessageI } from './FloatingMessage';
import Message from './message'

type ChatProps = {
	username: string,
	msg:MessageI[]
}

const Chat = ({ msg, username } : ChatProps) => {
	const messagesList = (): JSX.Element[] => {
		let sortArray = [...msg]
		sortArray.sort((a:any, b:any) => {return( a.id - b.id)})
		msg = sortArray
		return msg.map((message, index) => {
			return (
				<Message key={index} message={message} own={message.author === username}/>
			)})
	}

	const test = () => {
		return (
			<p>Send the first message !</p>
		)
	}

	return (
		<div>
			{
				msg != null ?
					messagesList()
				:
				test()
			}
		</div>
	)
}

export default Chat;
