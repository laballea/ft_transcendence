import React from 'react'

// Types
import { IconType } from 'react-icons';

// Components
import {FiSmile} from 'react-icons/fi'

type MiniButtonSecondaryProps = {
	cta : string,
	icon: IconType,
	onClick : () => void
}

const MiniButtonSecondary = ({cta, onClick, icon } : MiniButtonSecondaryProps) => {
	const Icon = icon;
	return (
		<button	
				className="	bg-transparent
							font-space text-[16px] text-slate-400 hover:text-slate-200
							transition-all duration-300 ease-in-out
							flex justify-center items-center gap-[8px]" 
				onClick={onClick} >
				<Icon className="w-[16px] h-[16px]"></Icon>
				<p>{ cta }</p>
		</button>
	)
}

MiniButtonSecondary.defaultProps = {
	cta: "Default",
	onClick: () => {
		console.log("GO MESSAGE PAGE")
	},
	icon: {FiSmile}
}

export default MiniButtonSecondary
