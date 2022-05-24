import React from 'react'
import Header from '../header'
import './style.css';
import { useNavigate } from "react-router-dom";

export default function Profil() {
	let navigate = useNavigate();
	
	return (
		<>
			<div className='header'>
				<div className='main-container'>
					<div className='profil-header'>
						<button className='profil-header' onClick={() => {navigate('/')}}>Go back</button>
					</div>
				</div>
			</div>
			<div>
				PROFIL
			</div>
		</>
	)
}