import React from 'react'

// Types
import { IconType } from 'react-icons';

// Components
import {FiSmile} from 'react-icons/fi'

type NavBarButtonPrimaryProps = {
	cta : string,
	icon: IconType,
	onClick : () => void
}

const NavBarButtonPrimary = ({cta, onClick, icon } : NavBarButtonPrimaryProps) => {
	const Icon = icon;
	return (
		<button	
				className="	bg-transparent border-2 border-slate-400 hover:border-slate-200 h-[64px] w-[200px]
							font-space text-[20px] text-emerald-400 hover:text-slate-200" 
				onClick={onClick} >
				what
				<Icon></Icon>
				<p>{ cta }</p>
		</button>
	)
}

NavBarButtonPrimary.defaultProps = {
	cta: "Default",
	onClick: () => { console.log("Default Click : no actions assigned bro")},
	icon: {FiSmile}
}

export default NavBarButtonPrimary
