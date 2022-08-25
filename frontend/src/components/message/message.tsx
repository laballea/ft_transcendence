import React from "react";
import { MessageI } from './FloatingMessage';


type MessageProps = {
	message: MessageI,
	own:boolean
}

const Message = ({ message, own }:MessageProps) => {
	let date = new Date(message.date)

	return (
		<div >
			{!own ?
				<div	className="	flex flex-col
									w-[80%]
									p-[8px] m-[8px]
									font-space text-[12px] text-slate-200
									bg-slate-600 rounded-sm
									right-0 
									">
					<p className="text-[8px] text-slate-400">
						{ date.getHours() }:{ date.getMinutes() }
					</p>
					<p>
						{ message.content }
					</p>
				</div>
				:
				<div	className="	flex flex-col 
									w-[80%]
									p-[8px] m-[8px]
									font-space text-[12px] text-slate-200
									bg-slate-800 rounded-sm
									ml-[calc(20%-8px)]
									">
					<p className="text-[8px] text-slate-400">
						{ 
							date.getHours() 
						}
						:
						{
							date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes() 
						} 
					</p>
					<p>
						{ message.content }
					</p>
				</div>
			}
		</div>
	)
}

export default Message;