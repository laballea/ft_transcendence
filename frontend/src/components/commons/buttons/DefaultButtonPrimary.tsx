import React from 'react'

// Types
import { IconType } from 'react-icons';

// Components
import {FiSmile} from 'react-icons/fi'

type DefaultButtonPrimaryProps = {
	cta : string,
	icon: IconType,
	onClick : () => void,
	disable:boolean
}

const DefaultButtonPrimary = ({cta, onClick, icon, disable } : DefaultButtonPrimaryProps) => {
	const Icon = icon;
	return (
		<button	
				className="	bg-transparent border-2 border-slate-400 hover:border-slate-200 h-[32px] sm:h-[48px] w-[160px] sm:w-[164px] rounded
							font-space text-[16px] text-slate-400 hover:text-slate-200
							transition-all duration-300 ease-in-out
							flex justify-center items-center" 
				onClick={onClick}
				disabled={disable}>
				<Icon className="w-[24px] h-[24px] mr-[8px]"></Icon>
				<p>{ cta }</p>
		</button>
	)
}

DefaultButtonPrimary.defaultProps = {
	cta: "Default",
	onClick: () => { console.log("Default Click : no actions assigned")},
	icon: {FiSmile},
	disable:false
}

export default DefaultButtonPrimary
