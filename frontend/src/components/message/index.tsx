import React, {useState} from 'react';
import Chat from './chat'
import Com from './com'
import { useDispatch, useSelector } from 'react-redux'
import IconButton from '../commons/buttons/IconButton';
import { FiLogOut, FiX } from 'react-icons/fi';
import { setCurrentConv } from '../../store/global/reducer';
export interface MessageI {
		author: string
		content: string
		date: string
	
}

function Message() {
	const global = useSelector((state: any) => state.global)
	const dispatch = useDispatch();
	const conv = global.convID == -1 ? 
				{
					id:-1,
					msg:[],
					name:global.clientChat,
					users:[{username:global.clientChat}]
				}
				:
				global.conv.find((conv:any) => conv.id == global.convID)
	return (
		<div className="chat" style={{margin:50, width:400, height:500, display:'flex', flexDirection:'column', justifyContent:"center"}}>
			<div style={{flex:1, display:'flex', flexDirection:"row"}}>
				<h3 style={{color:'white'}}>Chat /{conv.users.length > 2 ? conv.name : conv.users.find((user:any) => user.username != global.username).username}</h3>
				<IconButton icon={FiX} onClick={()=>{dispatch(setCurrentConv({convID:undefined}))}}></IconButton>
			</div>
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