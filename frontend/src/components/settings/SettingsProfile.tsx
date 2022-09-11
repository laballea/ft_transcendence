import React, { useState } from 'react'
import { FiEdit2 } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { editUsernameSocket } from '../../context/socket';
import SettingsProfilPicChoice from './SettingsProfilPicChoice';

// Assets
type SettingsProfileProps = {
	username: string,
	userImage: string
}

const SettingsProfile = ({username, userImage} : SettingsProfileProps) => {
	const navigate = useNavigate();
	const global = useSelector((state: any) => state.global)
	const backtext : string = "<- back";
	const [editProfilPic, setEditProfilPic] = useState(false);
	const [newUsername, setNewUsername] = useState(username);


	const changeUserName = (event : any) => {
		event.preventDefault(); // prevents render of component
		if (event.target.value !== username)
		{
			editUsernameSocket(global, newUsername)
		}
		
	}

	return (
		<>
			<div className='flex items-center justify-self-stretch'>
				<button 
					className="font-space w-24  text-slate-400 pr-4"
					onClick={ () => navigate("/app") }> 
					{ backtext }
				</button>
				<div  className='w-full border h-[2px] border-slate-700'></div>
			</div>
			<h2 className='font-pilowlava text-[64px] text-transparent backgroundTextOutline'>Profile</h2>
			<div className='flex items-center gap-[40px]'>
				<div className='flex flex-row'>
					<div className='absolute z-10 w-[200px] h-[200px] rounded-full flex items-center justify-center
									text-slate-200 bg-slate-800/50
									opacity-0 hover:opacity-100
									cursor-pointer
									transition-all duration-300 ease-in-out'>
						<FiEdit2 size='24px' onClick={() => {setEditProfilPic(!editProfilPic)}}/>
					</div>
					<div className='w-[200px] h-[200px] rounded-full'>
						<img src={userImage} width="200" height="200" alt="userimage" className='rounded-full'></img>
					</div>
				</div>
				<form 	onSubmit={
							changeUserName
						}
						className=' relative
									flex items-center gap-[8px] w-[408px]
									transition-all duration-300 ease-in-out
									font-space text-[40px] text-slate-400 hover:text-slate-200
									border-b-2 border-slate-400
									cursor pointer'>
						<input
							type="text"
							pattern="[A-Za-z0-9]+"
							title="This field is required"
							className='w-[368px] bg-transparent focus:outline-none'
							placeholder={newUsername}
							onChange={(event)=>setNewUsername(event.target.value)}
						>
						</input>
						<FiEdit2 className='absolute right-0
											w-[24px] h-[24px] 
											text-[24px] 
											z-20' 
							></FiEdit2>
						<button type='submit' className=''>
						</button>
				</form>
			</div>
			<div className='w-full'>
				{editProfilPic && <SettingsProfilPicChoice/>}
			</div>
			<div className='mb-[64px]'></div>
		</>
	)
}


SettingsProfile.defaultProps = {
}


export default SettingsProfile