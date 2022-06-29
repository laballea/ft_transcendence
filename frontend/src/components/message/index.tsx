import React, {useState} from 'react';
import Chat from './chat'
import Com from './com'
import { useSelector } from 'react-redux'

export interface MessageI {
		author: string
		content: string
		date: string
}

function Message() {
	const global = useSelector((state: any) => state.global)
	const conv = global.convID == -1 ? 
				{
					id:-1,
					msg:[],
					name:global.clientChat,
					users:[{username:global.clientChat}]
				}
				:
				global.conv.find((conv:any) => conv.id == global.convID)
	console.log("CONV", conv)
	return (
		<div className="chat" style={{margin:50, width:400, height:500, display:'flex', flexDirection:'column', justifyContent:"center"}}>
			<h3 style={{color:'white', flex:1}}>Chat /{conv.users.length > 2 ? conv.name : conv.users.find((user:any) => user.username != global.username).username}</h3>
			<div style={{overflow:"hidden", overflowY:"scroll", flex:10}}>
				<Chat msg={conv.msg} username={global.username}/>
			</div>
			<div style={{flex:1}}>
				<Com conv={conv} />
			</div>
		</div>
	)
}

export default Message;