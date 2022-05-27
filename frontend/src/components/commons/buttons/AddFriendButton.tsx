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
		<div className=" absolute top-0 left-0 w-full p-[12px] ">
			<button	
					className="	rounded
								flex justify-left items-center
								w-full p-[12px] h-[48px]
								bg-slate-700
								font-space text-[16px] text-slate-500 hover:text-slate-400
								transition-all duration-300 ease-in-out
								shadow-addFriend" 

					placeholder="Add a Friend"
					onClick={onClick} >
					<Icon className="sm:w-[24px] w-[16px] h-[24px] mr-[12px]"></Icon>
					<p>
						Add a Friend
					</p>
			</button>
		</div>
	)
}

AddFriendButton.defaultProps = {
	onClick: () => { console.log("Default Click : no actions assigned")},
}

export default AddFriendButton
