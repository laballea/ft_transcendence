import React from 'react'
import { FiEdit2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom'

// Assets
type SettingsProfileProps = {
	username: string,
	userImage: string
}

const SettingsProfile = ({username, userImage} : SettingsProfileProps) => {
	
	
	const navigate = useNavigate();
	const backtext : string = "<- back";

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
				<div className=''>
					<div className='absolute z-10 w-[200px] h-[200px] rounded-full flex items-center justify-center
									text-slate-200 bg-slate-800/50
									opacity-0 hover:opacity-100
									cursor-pointer
									transition-all duration-300 ease-in-out'>
						<FiEdit2 size='24px'></FiEdit2>
					</div>
					<div className='w-[200px] h-[200px] rounded-full'>
						<img src={userImage} width="200" height="200" alt="userimage" className='rounded-full'></img>
					</div>
				</div>
				<div className='flex items-center gap-[8px] 
								text-slate-400 hover:text-slate-200 font-space text-[40px]
								cursor-pointer
								transition-all duration-300 ease-in-out'>
					<p>{ username }</p>
					<FiEdit2 size='24px'></FiEdit2>
				</div>
			</div>
			<div className='mb-[64px]'></div>
		</>
	)
}


SettingsProfile.defaultProps = {
}


export default SettingsProfile