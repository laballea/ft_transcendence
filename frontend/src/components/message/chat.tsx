import React from "react";
import { MessageI } from './index';
import Message from './message'

type ChatProps = {
	username: string,
	msg:MessageI[]
}

const Chat = ({ msg, username }:ChatProps) => {

	const messagesList = (): JSX.Element[] => {
		return msg.map((message) => {
			return (
				<Message message={message} own={message.author == username}/>
			)
		})
	}

	return (
		<ul>
			{messagesList()}
		</ul>
	)
}

export default Chat;
