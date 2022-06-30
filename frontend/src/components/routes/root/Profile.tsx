import React, {useContext} from 'react'

// Components

// Hooks
import { useNavigate } from "react-router-dom";
import { SocketContext } from '../../../context/socket';

const Profile = () => {
	let navigate = useNavigate();
	const socket = useContext(SocketContext);

	return (
		<>
			<div style={{justifyContent:'center', color:'white'}}>
				<p>PROFILE</p>
				<button onClick={() => {navigate('/home')}}>Go back</button>
			</div>
		</>
	)
}

export default Profile