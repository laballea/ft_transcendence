import React from "react";
import { MessageI } from './index';


type MessageProps = {
	message: MessageI,
	own:boolean
}

const Message = ({ message, own }:MessageProps) => {
	let date = new Date(message.date)

	return (
		<div key={date.getTime()}>
			{!own ?
				<div style={{color:'white', padding:'5px', display:"flex",
				flexDirection:"column",alignItems:"flex-end"}}>
					<p >
						{message.author} {date.getHours()}:{date.getMinutes()}
					</p>
					<p className="justify-right">
						{message.content}
					</p>
				</div>
				:
				<div style={{color:'white', padding:'5px', display:"flex",
				flexDirection:"column",alignItems:"flex-start"}}>
					<p >
						{date.getHours()}:{date.getMinutes()} {message.author}
					</p>
					<p className="justify-right">
						{message.content}
					</p>
				</div>
			}
		</div>
	)
}

export default Message;