import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentRoom } from '../../store/global/reducer'

const RoomBar = () => {
	const global = useSelector((state: any) => state.global)
	const dispatch = useDispatch()
	
	const roomList = global.room.length > 0 ? global.room.map((room: any) => 
		<button /*className="bg-slate-700 flex flex-row justify-left items-end m-[2px] w-[80px] rounded"*/ key={room.id}
			// onClick={() => dispatch(setCurrentRoom({id:room.id}))}
		>
			{room.name}
		</button>
	): []
	return (
		<div style={{color:'white'}}>
			{roomList}
			<h1>bonjour</h1>
		</div>
	)
}

export default RoomBar;
