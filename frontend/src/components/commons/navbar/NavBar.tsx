import React from 'react'

// Hooks
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../../store/global/reducer'
import { useNavigate } from "react-router-dom";

export default function NavBar() {
	let navigate = useNavigate();
	const global = useSelector((state: any) => state.global)
	const dispatch = useDispatch()

	return (
		<div>
			<div>
				<button onClick={() => {navigate('Profil')}}>{global.username}</button>
			</div>
			<div>
				<button onClick={() => {dispatch(logout())}}>Log out</button>
			</div>
		</div>
	)
}