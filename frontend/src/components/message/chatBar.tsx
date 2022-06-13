import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentConv } from '../../store/global/reducer'
const ChatBar = () => {
	const global = useSelector((state: any) => state.global)
	const dispatch = useDispatch()
	
	const convList = global.conv.length > 0 ? global.conv.map((conv: any) =>  
		<button className="bg-slate-700 flex flex-row justify-left items-end m-[2px] w-[80px] rounded" key={conv.id}
			onClick={() => dispatch(setCurrentConv({id:conv.id}))}
		>
			{conv.users.length > 2 ? conv.name : conv.users.find((user:any) => user.username != global.username).username}
		</button>
	): [];
  	return (
		<div className="relative flex-row flex justify-end bg-slate-800 h-[30px] w-full">
			{convList}
		</div>
	)
}

export default ChatBar
