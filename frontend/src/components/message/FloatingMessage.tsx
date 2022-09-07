import React, {useEffect, useState} from 'react';
import Chat from './chat'
import Com from './com'
import { useDispatch, useSelector } from 'react-redux'
import IconButton from '../commons/buttons/IconButton';
import { FiDelete, FiLogOut, FiSettings, FiTrash2, FiX } from 'react-icons/fi';
import { setCurrentConv } from '../../store/global/reducer';
import './noScrollBar.css'
import { truncateString } from '../commons/utils/truncateString';
import { deleteMember } from '../../context/socket';
import NavBarButtonSecondary from '../commons/buttons/NavBarButtonSecondary';

export interface MessageI {
		author: string
		content: string
		date: string
}

function FloatingMessage() {
	const global = useSelector((state: any) => state.global)
	const dispatch = useDispatch();
	const [settings, setSettings] = useState(false)
	const conv = global.currentConv === -1 ? 
				{
					id:-1,
					msg:[],
					name:global.clientChat,
					users:[{username:global.clientChat}]
				}
				:
				global.currentConv

	useEffect(() => {
		var element = document.getElementById("someRandomID");
		if (element != null)
			element.scrollTop = element.scrollHeight;
	  });
	const users = conv.adminId !== undefined ? conv.users.map((user: {id:number, username:string}, index:number) =>
		<div className={`bg-slate-700 flex flex-row justify-center items-end m-[2px] w-[80px] text-center rounded text-slate-400`} key={index}>
			<h3>{ truncateString(user.username, 9)}</h3>
			{conv.adminId === global.id && conv.adminId !== user.id &&
				<IconButton icon={FiX} onClick={()=>{deleteMember(global, conv.id, user.id)}}></IconButton>
			}
		</div>): [];

	return (
		<div className='w-[400px] h-[460px] 
						flex justify-center flex-col
						rounded-md
						drop-shadow-custom1
						bg-slate-700'>
			<div className='w-full h-auto p-[8px] flex items-center justify-between bg-slate-700 drop-shadow-custom2'>
				{conv.adminId !== undefined &&
					<IconButton icon={FiSettings} onClick={()=>{setSettings(!settings)}}></IconButton>
				}
				<h3 className='font-space text-slate-200'>
					{conv.adminId !== undefined ? conv.name : conv.users.find((user:any) => user.username !== global.username).username}
				</h3>
				<IconButton icon={FiX} onClick={()=>{dispatch(setCurrentConv({conv:undefined}))}}></IconButton>
			</div>
			{settings ?
				<div className='flex flex-col flex-grow items-center'>
					<div id="someRandomID" className='overflow-y-scroll flex-grow'>
						{users}
					</div>
					<div className='flex flex-row'>
						{ conv.adminId === global.id ?
							<NavBarButtonSecondary cta="Delete Room" icon={FiTrash2} onClick={()=>{deleteMember(global, conv.id, global.id)}}/>
							:
							<NavBarButtonSecondary cta="Quit Room" icon={FiLogOut} onClick={()=>{deleteMember(global, conv.id, global.id)}}/>
						}
					</div>
				</div>
				:
				<div id="someRandomID" className='overflow-y-scroll flex-grow'>
					<Chat msg={conv.msg} username={global.username}/>
				</div>
			}
			<div className='w-full h-auto p-[4px] 
							flex items-center bg-slate-700
							drop-shadow-custom1'>
				<Com conv={conv} />
			</div>
		</div>
	)
}

export default FloatingMessage;