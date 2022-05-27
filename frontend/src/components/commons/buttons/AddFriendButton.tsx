import React from 'react'

// Types

// Components
import { FiPlus } from 'react-icons/fi'

type AddFriendButtonProps = {
	onClick : () => void
}

const AddFriendButton = ({ onClick } : AddFriendButtonProps) => {
	const Icon = FiPlus;
	return (
		<button	
				className="	bg-slate-600 h-[48px] w-full rounded
							flex justify-left items-center p-[12px]
							font-space text-[16px] text-slate-400 hover:text-slate-200
							transition-all duration-300 ease-in-out" 

				placeholder="Add a Friend"
				onClick={onClick} >
				<Icon className="sm:w-[24px] w-[16px] h-[24px] mr-[12px]"></Icon>
				<p>
					Add a Friend
				</p>
		</button>
	)
}

AddFriendButton.defaultProps = {
	onClick: () => { console.log("Default Click : no actions assigned")},
}

export default AddFriendButton
