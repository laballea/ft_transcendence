import React, {useContext, useEffect, useState} from 'react'

// Components
import NavBar from '../../navbar/NavBar'
import Room from '../../room';
import RoomBar from '../../room/roomBar';

// Components

// Hooks
import { useNavigate } from "react-router-dom";
import ChatRooms from '../../room/ChatRooms';

const Groupe = () => {
	let navigate = useNavigate();
	
	return (
		<div className="w-full h-screen relative bg-slate-900">
			<NavBar/>
			<div className="absolute flex justify-between
							w-full top-[80px] sm:top-[112px] bottom-0 sm:bottom-[48px]">
				<ChatRooms/>
			</div>
			{/* <RoomBar/> */}
		</div>
	)
}

export default Groupe