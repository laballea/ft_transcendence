import React, {useEffect} from 'react';
import Chat from './chat'
import Com from './com'
import { useDispatch, useSelector } from 'react-redux'
import IconButton from '../commons/buttons/IconButton';
import { FiX } from 'react-icons/fi';
import { setCurrentConv } from '../../store/global/reducer';
import './noScrollBar.css'

export interface MessageI {
		author: string
		content: string
		date: string
}

function FloatingMessage() {
	const global = useSelector((state: any) => state.global)
	const dispatch = useDispatch();
	const conv = global.convID === -1 ? 
				{
					id:-1,
					msg:[],
					name:global.clientChat,
					users:[{username:global.clientChat}]
				}
				:
				global.conv.find((conv:any) => conv.id === global.convID)
	useEffect(() => {
		var element = document.getElementById("someRandomID");
		if (element != null)
			element.scrollTop = element.scrollHeight;
	  });
	return (
		<div className='w-[340px] h-[400px] 
						flex justify-center flex-col
						rounded-md
						drop-shadow-custom1
						bg-slate-700'>
			<div className='w-full h-auto p-[8px] flex items-center justify-between bg-slate-700 drop-shadow-custom2'>
				<h3 className='font-space text-slate-200'>
					{conv.users.length > 2 ? conv.name : conv.users.find((user:any) => user.username !== global.username).username}
				</h3>
				<IconButton icon={FiX} onClick={()=>{dispatch(setCurrentConv({convID:undefined}))}}></IconButton>
			</div>
			<div id="someRandomID" 
					className='overflow-y-scroll flex-grow'>
				<Chat msg={conv.msg} username={global.username}/>
			</div>
			<div className='w-full h-auto p-[4px] 
							flex items-center bg-slate-700
							drop-shadow-custom1'>
				<Com conv={conv} />
			</div>
		</div>
	)
}

export default FloatingMessage;