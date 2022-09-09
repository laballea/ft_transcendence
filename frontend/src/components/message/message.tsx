import React from "react";
import { MessageI } from './FloatingMessage';


type MessageProps = {
	message: MessageI,
	own:boolean
}

const Message = ({ message, own }:MessageProps) => {
	let date = new Date(message.date)

	return (
		<div>
			<div
				className=" flex flex-col break-words
							p-[16px]
							" 
			>
					{own ?
					<div className="break-words self-end">
						
							<p className="font-space text-[10px] text-purple-500 italic mb-1">
								{"you"} {date.getHours()}:{date.getMinutes()}
							</p>
							<p className="justify-right p-1 pr-3 pl-3 bg-purple-500 rounded-[14px]
											font-space text-[14px] text-slate-100
											break-words" >
								{message.content}
							</p>
					</div>
					:
					<div className="break-words self-start">
						<p className="text-slate-400 text-[8px] italic mb-1">
							{message.author} {date.getHours()}:{date.getMinutes()}
						</p>
						<p className="justify-left p-1 pr-3 pl-3 bg-slate-500 rounded-[14px]
										font-space text-[14px] text-slate-100
										break-words" >
									{message.content}
						</p>
					</div>
			}
			</div>
		</div>
	)
}

export default Message;