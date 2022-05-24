import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import './header.css';
import { logout } from '../../store/global/reducer'
import { useNavigate } from "react-router-dom";

export default function Header() {
	let navigate = useNavigate();
	const global = useSelector((state: any) => state.global)
	const dispatch = useDispatch()

	return (
		<div className='main-container'>
			<div className='profil-header'>
				<button className='profil-header' onClick={() => {navigate('Profil')}}>{global.username}</button>
			</div>
			<div className='logout-header'>
				<button className='logout-btn' onClick={() => {dispatch(logout())}}>Log out</button>
			</div>
		</div>
	)
}