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

	return (
		
		<div className="flex justify-between items-center w-full h-[80px] sm:h-[112px] p-[16px] sm:p-[24px] bg-slate-900"> 

			<div className="flex items-center">
				<NavBarButtonPrimary cta="Play Now" icon={FiZap}/>
				<NavBarButtonSecondary cta="Message" icon={FiMessageCircle} />
			</div>

			<div>
				<NavProfile/>
				{/* <button onClick={() => {navigate('profile')}}>{global.username}</button> */}
				{/* <button onClick={() => {dispatch(logout())}}>Log out</button> */}
			</div>
	
		</div>
	)
}

export default NavBar