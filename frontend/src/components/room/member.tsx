import React from 'react'
import { useSelector } from 'react-redux'
import { socket } from '../../context/socket'

interface IProps {
	room: any
}

const Member: React.FC<IProps> = ({ room }) => {
	const global = useSelector((state: any) => state.global)

	const deleteMember = (userId: number) => {
		console.log('delete member', userId)
		socket.emit('deleteMember', {
			roomId: room.id,
			userId: userId,
			admin: global.username,
		});
	}

	const memberList = room.users.map((user: any) => 
		<div>
			<p className="bg-slate-700 m-[2px] w-[80px] rounded">
				{user.username}
			<button
				onClick={() => deleteMember(user.id)}
			>
				X
			</button>
			</p>
		</div>
	)
	return (
		<div style={{color:'white'}}>
			{memberList}
		</div>
	)
}

export default Member;
