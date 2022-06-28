import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { user, status, Room } from '../../common/types'
import { socket } from '../../context/socket'
// import { setCurrentMember } from '../../store/global/reducer'

interface IProps {
	room: any
}

const Member: React.FC<IProps> = ({ room }) => {
	const global = useSelector((state: any) => state.global)

	const deleteMember = (userId: number) => {
		console.log('delete member', userId)
		socket.emit('deleteMember', {
			roomId: room.id,
			user: userId,
			admin: global.username,
		});
	}

	console.log(global.room)
	const memberList = room.users.map((user: any) => 
		<div>
			<p className="bg-slate-700 m-[2px] w-[80px] rounded">
				{user.username}
			</p>
			<button className="bg-slate-700 m-[2px] rounded"
				onClick={() => deleteMember(user.id)}
			>
				X
			</button>
		</div>
	)
	return (
		<div style={{color:'white'}}>
			{memberList}
		</div>
	)
}

export default Member;
