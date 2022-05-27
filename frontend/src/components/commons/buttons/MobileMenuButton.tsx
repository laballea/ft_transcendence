import React from 'react'

// Types
import { IconType } from 'react-icons';

// Components
import { FiSmile } from 'react-icons/fi'

type MobileMenuButtonProps = {
	cta : string,
	icon: IconType,
	onClick : () => void,
	logout : boolean
}

const MobileMenuButton = ({cta, onClick, icon, logout } : MobileMenuButtonProps) => {
	const Icon = icon;
	return (
		<>
		{
			!logout ?
			<button	
			className="	bg-transparent border-b-2 border-slate-700 h-[88px] w-full							font-pilowlava text-[28px] text-slate-400 
						transition-all duration-300 ease-in-out
						flex justify-center items-center" 
			onClick={onClick} >
					<Icon className="w-[40px] h-[40px] mr-[8px] stroke-4 "></Icon>
					<p>{ cta }</p>
					{
						logout 
						?
						<div className="absolute bottom-0 h-[2px] w-full"></div>
						: null
					}
			</button>
			:
			<button	className="	bg-transparent  h-[88px] w-full							
								border-t-2 border-slate-700
								font-pilowlava text-[28px] text-red-600
								transition-all duration-300 ease-in-out
								flex justify-center items-center" 
				onClick={onClick} >
					<Icon className="w-[40px] h-[40px] mr-[8px] stroke-4 "></Icon>
					<p>{ cta }</p>
			</button>
			
		}
		</>

	)
}

MobileMenuButton.defaultProps = {
	cta: "Default",
	onClick: () => { console.log("Default Click : no actions assigned")},
	icon: {FiSmile},
	logout: false
}

export default MobileMenuButton
