import React, {useState} from 'react';
import Chat from './chat'
import Com from './com'
import { useSelector } from 'react-redux'

export interface IState {
	msg: {
		author: string
		content: string
		date: string
	}[]
}

function Message() {
	const global = useSelector((state: any) => state.global)
	const conv = global.conv.find((conv:any) => conv.id == global.convID)
	return (
		<div className="chat">
			<h3 style={{color:'white', padding:'200px'}}>Chat /{conv.name}</h3>
			<Chat msg={conv.msg}/>
			<Com conv={conv} />
		</div>
	)
}

export default Message;