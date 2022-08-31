import React from "react";
import { MessageI } from './index';


type MessageProps = {
	message: MessageI,
	own:boolean
}

const Message = ({ message, own }:MessageProps) => {
	let date = new Date(message.date)

	return (
		<div>
			<div style={{color:'white', padding:'5px', display:"flex",
			flexDirection:"column",alignItems:(own ? "flex-end" : "flex-start"), wordWrap: 'break-word'}}>
					{own ?
						<p className="text-green-400 italic">
							{"you"} {date.getHours()}:{date.getMinutes()}
						</p>
						:
						<p className="text-slate-400 italic">
							{message.author} {date.getHours()}:{date.getMinutes()}
						</p>
					}
				<p className="justify-right" style={{wordBreak: 'break-all'}}>
					{message.content}
				</p>
			</div>
		</div>
	)
}

export default Message;