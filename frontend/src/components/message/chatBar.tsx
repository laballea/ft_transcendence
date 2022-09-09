import React from 'react'
import { FiPlusCircle, FiUsers } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { setCreateRoom, setCurrentConv } from '../../store/global/reducer'
import { truncateString } from '../commons/utils/truncateString'

const ChatBar = () => {
	const global = useSelector((state: any) => state.global)
	const dispatch = useDispatch()

	const convList = global.conv.length > 0 ? global.conv.map((conv: any) =>
		
		<button className="bg-transparent w-full p-4 pl-4 pr-4 rounded-[8px]
							border-[1px] border-slate-400 hover:border-slate-200 
							flex items-center gap-2 justify-between
							font-space text-slate-400 hover:text-slate-200 text-[16px]
							transition-all duration-300 ease-in-out
							cursor-pointer
							"
					key={conv.id}
			onClick={() => dispatch(setCurrentConv({conv:conv}))}
		>
			{ truncateString(conv.adminId !== undefined ? conv.name : conv.users.find((user:any) => user.username !== global.username).username, 9)}
			{	
				conv.adminId !== undefined &&
				<>
					<FiUsers/>
				</> 
			}
		</button>
	): [];
	
	return (
			<div className="relative overflow-scroll w-full h-full
							p-2
							flex flex-col gap-2">
				{convList}
			</div>
		// <div className='flex'>
		// 	{/* <button
		// 		className="bg-slate-700 flex flex-row justify-center items-end m-[2px] w-[80px] text-center rounded text-slate-400 text-slate-500 hover:text-slate-400 roundedtransition-all duration-300 ease-in-out"
		// 		onClick={()=>{dispatch(setCreateRoom({}))}}
		// 	>
		// 		<FiPlusCircle className="sm:w-[24px] w-[16px] sm:h-[24px] h-[16px]"></FiPlusCircle>
		// 	</button> */}
		// </div>
	)
}

export default ChatBar
