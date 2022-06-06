import React from 'react'

// Components

// Hooks
import { useNavigate } from "react-router-dom";

const Profile = () => {
	let navigate = useNavigate();
	
	return (
		<>
			<div>
				<div>
					<div>
						<button onClick={() => {navigate('/home')}}>Go back</button>
					</div>
				</div>
			</div>
			<div>
				PROFILE
			</div>
		</>
	)
}

export default Profile