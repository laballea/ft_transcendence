import React, { useContext } from 'react'

// Components
import NavBarButtonPrimary from		'../commons/buttons/NavBarButtonPrimary'
import NavBarButtonSecondary from	'../commons/buttons/NavBarButtonSecondary'
import NavBarButtonHome from		'../commons/buttons/NavBarButtonHome'

import NavProfile from './NavProfile'

// Icons
import { FiZap, FiMessageCircle, FiEyeOff, FiAlertOctagon} from 'react-icons/fi'

// Hooks
import { useSelector, useDispatch } from 'react-redux'
import { logout, setGameMode, setGameStatus } from '../../store/global/reducer'
import { useNavigate } from "react-router-dom";

//socket
import { SocketContext } from '../../context/socket';
import { gamemode, status } from '../../common/types'
import ChooseModeButton from '../commons/buttons/ChooseModeButton'

const NavBar = () => {
	let navigate = useNavigate();
	const global = useSelector((state: any) => state.global)
	const dispatch = useDispatch()
	const socket = useContext(SocketContext);
	// Show Menu hook
	return (
		<header className="absolute top-0 left-0 w-full h-[80px] sm:h-[112px] bg-transparent
						flex justify-between items-center p-[16px] sm:p-[24px] 
						bg-slate-900"> 

			<div className="flex items-center">
				<div className="hidden sm:block">
					<NavBarButtonHome onClick={() => {navigate('/app')}} />
				</div>
				{ global.status !== status.InGame &&  global.status !== status.Spectate?
						<div className="hidden sm:block">
							<NavBarButtonPrimary cta="Play Now" disable={global.status === status.InQueue || global.status === status.InGame} icon={FiZap}
							onClick={()=>{
									socket.emit("FIND_GAME", {
										client_send: global.username,
										mode:global.gamemode,
										jwt:global.token
									})
									dispatch(setGameStatus(status.InQueue))
								}					
							}/>
							<div className="absolute bottom-[4px] w-[200px] flex flex-row items-center justify-center text-[8px]">
								<ChooseModeButton cta="normal" disable={global.status === status.InQueue || global.status === status.InGame} check={global.gamemode === gamemode.normal} onClick={() => {dispatch(setGameMode(gamemode.normal))}}/>
								<div className='w-[20%] h-[1px] m-[4px] bg-slate-500'></div>
								<ChooseModeButton cta="boost" disable={global.status === status.InQueue || global.status === status.InGame} check={global.gamemode === gamemode.boost} onClick={() => {dispatch(setGameMode(gamemode.boost))}}/>
							</div>
						</div>
						:
						<div className="hidden sm:block">
							<NavBarButtonPrimary cta={global.status === status.Spectate ? "Leave" : "Resign"} icon={global.status === status.Spectate ? FiEyeOff : FiAlertOctagon}
							onClick={()=>{
									socket.emit("QUIT_GAME", {
										type:global.status === status.Spectate ? "Leave" : "Resign",
										client_send: global.username,
										gameID:global.gameID,
										jwt:global.token
									})
								}
							}/>
						</div>
				}
				

				<div className="hidden sm:block">
					<NavBarButtonSecondary cta="Message" icon={FiMessageCircle} onClick={()=>{navigate('/app/message')}}/>
				</div>
			</div>

			<div>
				<NavProfile 
					username={global.username}
					userImage={global.userImage || undefined}
					onClickSettings={() => {navigate('/app/settings')}}
					onClickLogOut={() => {socket.disconnect();dispatch(logout())}}
					onClickProfile={() => {navigate('/app/profile', { state: {id:global.id} })}}
					onClickHome={() => {navigate('/app')}}
				/>
				{/* <button onClick={() => {navigate('profile')}}>{global.username}</button> */}
				{/* <button onClick={() => {dispatch(logout())}}>Log out</button> */}
			</div>
	
		</header>
	)
}

export default NavBar