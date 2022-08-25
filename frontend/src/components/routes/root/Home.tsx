import React from 'react'

// Components
import NavBar from '../../navbar/NavBar'
import ContactList from '../../contactList/ContactList';
import Message from '../../message/FloatingMessage';
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
import BackgroundLobby from '../../commons/backgrounds/BackgroundLobby';

export default function Home() {
	const global = useSelector((state: any) => state.global)

	return (
		<div className="w-full h-screen relative bg-slate-900">
			{
				global.convID !== undefined && 
					<div className='absolute left-[12px] bottom-[40px] z-50'>
						<Message/>
					</div>

			}
			<NavBar/>
			<div className="absolute flex justify-between
							w-full top-[80px] sm:top-[112px] bottom-0 sm:bottom-[48px]">
				<div className="w-[calc(100%-400px)] h-full flex sm:block justify-between z-10">
					<div className="relative w-full h-full flex justify-between ">
						{
							(global.status === status.InGame 
								|| global.status === status.InQueue 
								|| global.status === status.Spectate)
							?
							 <Game/>
							:
							<div className='w-full h-full overflow-hidden'>
								<BackgroundLobby/>
							</div>
						}
					</div>
				</div>
				<div className="relative flex-initial flex w-full bg-slate-800 sm:w-[400px] flex-col h-full">
					<ContactList/>
				</div>
			</div>
			<Footer/>
		</div>
	)
}