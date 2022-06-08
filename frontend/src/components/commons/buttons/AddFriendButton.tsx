import React, {useState} from 'react'

// Types

// Components
import { FiPlus } from 'react-icons/fi'

type AddFriendButtonProps = {
	onSubmit : (username:string) => void
}

const AddFriendButton = ({ onSubmit } : AddFriendButtonProps) => {
	const Icon = FiPlus;
	const [username, setUsername] = useState("");
	const handleSubmit = async (event: any) => {
		// Prevent page reload
		event.preventDefault();
		onSubmit(username);
		setUsername("");
	};
	return (
		<div className=" absolute top-0 left-0 w-full p-[12px] ">
			<form onSubmit={handleSubmit}>
				<input	
					className="	rounded
								flex justify-left items-center
								w-full p-[12px] h-[48px]
								bg-slate-700
								font-space text-[16px] text-slate-500 hover:text-slate-400
								transition-all duration-300 ease-in-out
								shadow-addFriend" 

					placeholder="Add a Friend"
					value={username}
					onChange={e => setUsername(e.target.value)} required
					type="text"
				>
						{/* <Icon className="sm:w-[24px] w-[16px] h-[24px] mr-[12px]"></Icon> */}
						{/* <p>
							Add a Friend
						</p> */}
				</input>
			</form>


		</div>
	)
}

AddFriendButton.defaultProps = {
	onSubmit: () => {
		console.log("Default Click : no actions assigned")
	},
}

export default AddFriendButton
