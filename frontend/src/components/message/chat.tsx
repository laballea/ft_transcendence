import React from "react";
import { IState as IProps } from './index';

const Chat: React.FC<IProps> = ({ msg }) => {

	const renderList = (): JSX.Element[] => {
		return msg.map((message) => {
			return (
				<li className="Chat">
					<div className="Chat-header">
						<p style={{color:'white', paddingTop:'10px', paddingLeft: '200px'}}>{message.date} {message.author}: {message.content}</p>
					</div>
				</li>
			)
		})
	}
	return (
		<ul>
			{renderList()}
		</ul>
	)
}

export default Chat;