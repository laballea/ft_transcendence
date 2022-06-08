import React, {useState} from 'react';
import Chat from './chat'
import Com from './com'

export interface IState {
	msg: {
		author: string
		content: string
		date: string
	}[]
}

function Message() {

	const [msg, setMessage] = useState<IState["msg"]>([])

	return (
		<div className="chat">
			<h3 style={{color:'white', padding:'200px'}}>WhatsApp</h3>
			<Chat msg={msg}/>
			<Com msg={msg} setMessage={setMessage}/>
		</div>
	)
}

export default Message;