import React from 'react'

// Components
import NavBar from '../../navbar/NavBar'
import ContactList from '../../contactList/ContactList';
import Message from '../../message/index';
import Footer from '../../commons/footer/Footer';

// CSS
import '../../../assets/fonts/fonts.css';

//Redux
import { useSelector } from 'react-redux';
import ChatBar from '../../message/chatBar';
import ChatRooms from '../../room/ChatRooms';
import RoomBar from '../../room/roomBar';
import Room from "../../room/index";
import Game from '../../game/Game';
import { status } from '../../../common/types';
import { socket } from '../../../context/socket';

export default function Home() {
	const global = useSelector((state: any) => state.global)
	document.title = "FT_TRANS "+ global.username;

	const set2fa = () => {
		console.log("turn 2fa")
		socket.emit('turn-2fa', global.username);
	}

	return (
		<div className="w-full h-screen relative bg-slate-900">
			<NavBar/>
			<div className="absolute flex justify-between
							w-full top-[80px] sm:top-[112px] bottom-0 sm:bottom-[48px]">
				<div className="hidden w-[calc(100%-400px)] h-full flex sm:block justify-between bg-slate-700 z-50">
					<div className="relative h-[calc(100%-30px)] w-full flex justify-between bg-slate-700 ">
						{global.convID != undefined && <Message/>}
						{(global.status === status.InGame || global.status === status.InQueue) && <Game/>}
						<ChatRooms/>
						<button
							className="add-chat"
							onClick={() => set2fa()}
							style={{color:'white'}}
						>
							Turn 2fa
						</button>
						<RoomBar/>
						{global.roomID != undefined && <Room/>}
					</div>
					<ChatBar/>
				</div>
				<div className="relative flex-initial flex w-full bg-slate-800 sm:w-[400px] flex-col h-full">
					<ContactList/>
					{global.convID !== undefined && <Message/>}
				</div>
			</div>
			<Footer/>
		</div>
	)
}