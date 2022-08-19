import React from 'react'
import { useNavigate } from 'react-router-dom'

// Assets
type SettingsProfileProps = {
}

const SettingsProfile = ({} : SettingsProfileProps) => {
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
		</>
	)
}


SettingsProfile.defaultProps = {
}


export default SettingsProfile