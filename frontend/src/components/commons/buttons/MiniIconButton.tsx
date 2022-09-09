import React from 'react'

// Types
import { IconType } from 'react-icons';

// Components
import { FiSmile } from 'react-icons/fi'

type MiniIconButtonProps = {
	icon: IconType,
	color?: string,
	onClick : () => void
}

const MiniIconButton = ({onClick, icon, color} : MiniIconButtonProps) => {
	const Icon = icon;

	// Creates button class if colors are being assing or not
	if (color === "green")
	{
		return (
			<button
				className=" text-green-500 hover:text-green-400
				bg-transparent h-[16px]  w-[16px] sm:w-[24px] mr-[8px] roundedtransition-all duration-300 ease-in-out
				"
				onClick={onClick} >
				<Icon className="sm:w-[24px] w-[16px]  h-[16px]"></Icon>
			</button>
		)
	}
	else if (color === "red")
	{
		return (
			<button
				className=" text-red-500 hover:text-red-400
				bg-transparent h-[16px]  w-[16px] sm:w-[24px] roundedtransition-all duration-300 ease-in-out
				"
				onClick={onClick} >
				<Icon className="sm:w-[24px] w-[16px]  h-[16px]"></Icon>
			</button>
		)
		
	}
	else
	{
		return (
			<button
				className=" text-slate-400 hover:text-slate-200
							bg-transparent h-[16px]  w-[16px] sm:w-[24px] roundedtransition-all duration-300 ease-in-out
							"
				onClick={onClick} >
				<Icon className="sm:w-[24px] w-[16px]  h-[16px]"></Icon>
			</button>
		)
	}
}

MiniIconButton.defaultProps = {
	onClick: () => { console.log("Default Click : no actions assigned")},
	icon: {FiSmile}
}

export default MiniIconButton
