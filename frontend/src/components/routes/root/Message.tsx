import React from 'react'

// Components

// Hooks
import { useNavigate } from "react-router-dom";

const Message = () => {
	let navigate = useNavigate();

	return (
		<>
			<div style={{justifyContent:'center', color:'white'}}>
				<p>MESSAGE</p>
				<button onClick={() => {navigate('/home')}}>Go back</button>
			</div>
		</>
	)
}

export default Message