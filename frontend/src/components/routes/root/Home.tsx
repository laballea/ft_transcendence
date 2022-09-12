import React from 'react'

// Components
import NavBar from '../../navbar/NavBar'
import Footer from '../../commons/footer/Footer';
// CSS
import '../../../assets/fonts/fonts.css';

//Redux
import { useSelector } from 'react-redux';
import Game from '../../game/Game';
import { status } from '../../../common/types';
import BackgroundLobby from '../../commons/backgrounds/BackgroundLobby';
import SocialInterface from '../../commons/socialInterface/SocialInterface';

export default function Home() {
	const global = useSelector((state: any) => state.global)
	document.title = "FT_TRANS "+ global.username;
	return (
		<div className="w-full h-screen relative bg-slate-900">
			<NavBar/>
			<div className="absolute flex justify-between
							w-full top-[80px] sm:top-[112px] bottom-0 sm:bottom-[48px]">
				<div className="w-full h-full flex sm:block justify-between bg-slate-700 z-50">
					<div className="relative h-full w-full flex justify-between bg-slate-700 ">
						{
							(global.status === status.InGame 
								|| global.status === status.InQueue 
								|| global.status === status.Spectate)
							?
							<Game/>
							:
							<div className='w-full h-full'>
								<BackgroundLobby/>
							</div>
						}
						<SocialInterface/>
					</div>
				</div>
			</div>
			<Footer/>
		</div>
	)
}