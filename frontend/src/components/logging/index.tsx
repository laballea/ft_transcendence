import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { login } from '../../store/global/reducer'

import './logging.css';


export default function Logging() {
	const [username, setUsername] = useState("");
	const dispatch = useDispatch()

	const url = new URL("https://api.intra.42.fr/oauth/authorize");
	url.searchParams.append('client_id', "9384000c12d958f2a599467c2bd482b25cbb0ae8e588e3b3382720ff3d290d02");
	url.searchParams.append('redirect_uri', "http://localhost/");
	url.searchParams.append('state', "bonjour je m'appelle pas");
	url.searchParams.append('response_type', "code");
	const handleSubmit = async (event: any) => {
		// Prevent page reload
		event.preventDefault();
		const requestOptions = {
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json;charset=utf-8',
			  'Access-Control-Allow-Origin': '*',
			},
			body: JSON.stringify(
				{
					username: username,
				}
			)
		}
		fetch("http://localhost:5000/auth/login", requestOptions)
		.then(async response=>{
			if (response.ok){
				const resp = await response.text()
				dispatch(login({username:username, token:resp}))

			}
			else {
				console.log(response);
			}
		})
	  };

	return (
		<div>
			<form onSubmit={handleSubmit}>			
				<div className="container">
					<label><b>Username</b></label>
					<br/>
					<input type="text" value={username} onChange={e => setUsername(e.target.value)} required/>
				</div>
				<button className="btn" type="submit">Login</button>
				<button className="btn" onClick={event =>  window.location.href=url.toString()}>Log in 42</button>
			</form> 
		</div>
	);
}