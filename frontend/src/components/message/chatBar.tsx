import React from 'react'
import { FiPlusCircle, FiX } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { setCreateRoom, setCurrentConv, setCurrentRoom } from '../../store/global/reducer'
import IconButton from '../commons/buttons/IconButton'
import { truncateString } from '../commons/utils/truncateString'

const ChatBar = () => {
	const global = useSelector((state: any) => state.global)
	const dispatch = useDispatch()

	const convList = global.conv.length > 0 ? global.conv.map((conv: any) =>  
		<button className={`bg-slate-700 flex flex-row justify-center items-end m-[2px] w-[80px] text-center rounded
							${global.currentConv && conv.id === global.currentConv.id ? "text-green-300" : "text-slate-400"}`} key={conv.id}
			onClick={() => dispatch(setCurrentConv({conv:conv}))}
		>
			{ truncateString(conv.adminId !== undefined ? conv.name : conv.users.find((user:any) => user.username !== global.username).username, 9)}
		</button>
	): [];
	
	return (
		<div className="relative flex-row flex justify-end bg-slate-800 h-[30px] w-full">
			{convList}
			<button
				className="bg-slate-700 flex flex-row justify-center items-end m-[2px] w-[80px] text-center rounded text-slate-400 text-slate-500 hover:text-slate-400 roundedtransition-all duration-300 ease-in-out"
				onClick={()=>{dispatch(setCreateRoom({}))}}
			>
				<FiPlusCircle className="sm:w-[24px] w-[16px] sm:h-[24px] h-[16px]"></FiPlusCircle>
			</button>
		</div>
	)
}

export default ChatBar
