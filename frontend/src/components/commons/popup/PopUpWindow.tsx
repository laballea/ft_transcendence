import React, {useState} from 'react'

// Types

// Components
import { FiPlus } from 'react-icons/fi'

type PopUpWindowProps = {
	content : string
}

const PopUpWindow = ({ content } : PopUpWindowProps) => {
	const Icon = FiPlus;
	return (
		<div className=" absolute bottom-0 left-0 p-[12px] ">
				<p	
					className="	rounded
								flex justify-left items-center
								w-[200px] p-[24px] h-[48px]
								bg-slate-700
								font-space text-[16px] text-slate-500 hover:text-slate-400
								transition-all duration-300 ease-in-out
								shadow-addFriend" 
				>
					{content}
				</p>
		</div>
	)
}

PopUpWindow.defaultProps = {
	content: ""
}

export default PopUpWindow
