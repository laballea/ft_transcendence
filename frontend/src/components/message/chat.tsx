import React from "react";
import { MessageI } from './index';
import Message from './message'

type ChatProps = {
	username: string,
	msg:MessageI[]
}

const Chat = ({ msg, username }:ChatProps) => {

	const messagesList = (): JSX.Element[] => {
		console.log("display msg")
		return msg.map((message) => {
			return (
				<Message message={message} own={message.author == username}/>
			)
		})
	}

	const test = () => {
		console.log("test", msg)
		return (
			<p>Send the first message !</p>
		)
	}

	return (
		<ul>
			{
				msg != null ?
					messagesList()
				:
				test()
			}
		</ul>
	)
}

export default Chat;
