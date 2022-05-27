import React from 'react'

// Components
import NavBarButtonPrimary from		'../commons/buttons/NavBarButtonPrimary'
import NavBarButtonSecondary from	'../commons/buttons/NavBarButtonSecondary'

import NavProfile from './NavProfile'

// Icons
import { FiZap, FiMessageCircle } from 'react-icons/fi'

// Hooks
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../store/global/reducer'
import { useNavigate } from "react-router-dom";

const NavBar = () => {
	let navigate = useNavigate();
	const global = useSelector((state: any) => state.global)
	const dispatch = useDispatch()

	// Show Menu hook
	return (
		<header className="absolute top-0 left-0 w-full h-[80px] sm:h-[112px] bg-transparent
						flex justify-between items-center p-[16px] sm:p-[24px] 
						bg-slate-900"> 

			<div className="flex items-center">
				<NavBarButtonPrimary cta="Play Now" icon={FiZap}/>
				<div className="hidden sm:block">
					<NavBarButtonSecondary cta="Message" icon={FiMessageCircle} />
				</div>
			</div>

			<div>
				<NavProfile 
					username={global.username}
					// userImage={global.userImage}
					// onClickSettings={}
					onClickLogOut={() => {dispatch(logout())}}
					onClickProfile={() => {navigate('profile')}}
				/>
				{/* <button onClick={() => {navigate('profile')}}>{global.username}</button> */}
				{/* <button onClick={() => {dispatch(logout())}}>Log out</button> */}
			</div>
	
		</header>
	)
}

export default NavBar