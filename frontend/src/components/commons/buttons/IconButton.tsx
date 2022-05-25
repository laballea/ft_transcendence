import React from 'react'

// Types
import { IconType } from 'react-icons';

// Components
import {FiSmile} from 'react-icons/fi'

type IconButtonProps = {
	icon: IconType,
	onClick : () => void
}

const IconButton = ({onClick, icon } : IconButtonProps) => {
	const Icon = icon;
	return (
		<button	
				className="	bg-transparent h-[16px] sm:h-[24px] w-[16px] sm:w-[24px] rounded
							text-slate-400 hover:text-slate-200
							transition-all duration-300 ease-in-out" 
				onClick={onClick} >
				<Icon className="sm:w-[24px] w-[16px] sm:h-[24px] h-[16px]"></Icon>
		</button>
	)
}

IconButton.defaultProps = {
	onClick: () => { console.log("Default Click : no actions assigned")},
	icon: {FiSmile}
}

export default IconButton
