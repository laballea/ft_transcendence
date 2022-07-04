import React from 'react'
import { useNavigate } from 'react-router-dom'

// Components


type ProfileActionsProps = {
}

const ProfileActions = ({} : ProfileActionsProps) => {
	
	const navigate = useNavigate();
	const backtext : string = "<- back";

	return (
		<>
			<div className='flex items-center justify-self-stretch mb-3'>
				<button 
					className="font-space w-24  text-slate-400 pr-4"
					onClick={ () => navigate("/app") }> 
					{ backtext }
				</button>
				<div  className='w-full border h-[2px] border-slate-700'></div>
			</div>
		</>
	)
}


ProfileActions.defaultProps = {
}


export default ProfileActions