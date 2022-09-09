import React, {useEffect, useState} from 'react'
import { IconType } from 'react-icons';

type AddFriendButtonProps = {
	cta : string,
	value:string,
	onClick : (username:string) => void,
}

const AddFriendButton = ({ cta, value, onClick } : AddFriendButtonProps) => {

	return (
		<div className="absolute top-0 left-0 w-full p-[12px] ">
				<input	
					className="	rounded
								flex justify-left items-center
								w-full p-[12px] h-[48px]
								bg-slate-700
								font-space text-[16px] placeholder:text-slate-400 hover:placeholder:text-slate-300 text-slate-300
								transition-all duration-300 ease-in-out
								placeholder:transition-all placeholder:duration-300 placeholder:ease-in-out
								shadow-addFriend" 

					placeholder={cta}
					value={value}
					onChange={e => onClick(e.target.value)} required
					type="text"
				>
				</input>


		</div>
	)
}

AddFriendButton.defaultProps = {
	onSubmit: () => {
		console.log("Default Click : no actions assigned")
	},
}

export default AddFriendButton
