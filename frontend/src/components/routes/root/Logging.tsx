import React, { useState } from 'react'

// Components
import BackgroundLogging from '../../commons/backgrounds/BackgroundLogging';
import Footer from '../../commons/footer/Footer';
// Hooks
import { useDispatch } from 'react-redux'
import { login } from '../../../store/global/reducer'
import { useNavigate } from 'react-router-dom';


const Logging = () => {
	const [username, setUsername] = useState("");
	const navigate = useNavigate();
	const url = new URL("http://localhost:5000/auth/login"); //url for intra auth

	/*
		POST username at auth/login, back respond with jwt token
		and we redirect to home with jwt in query
	*/
	const handleSubmit = async (event: any) => {
		event.preventDefault();// Prevent page reload
		const requestOptions = {
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json;charset=utf-8',
			  'Access-Control-Allow-Origin': '*',
			},
			body: JSON.stringify({
				username: username,
			})
		}
		fetch("http://localhost:5000/auth/login", requestOptions)
		.then(async response=>{
			if (response.ok){
				const resp:any = await response.json()
				navigate(`/home?jwt=${resp.token}`)
			}
		})
	  };

	return (
		<>
			<BackgroundLogging/>
			<div className="absolute w-screen h-screen flex flex-col justify-center items-center">
				<form onSubmit={handleSubmit}>			
					<div className="flex flex-col mb-[40px]">
						<label className="font-space text-slate-400 text-xs" >test-login:</label>
						<input className="h-8 w-[260px] p-4 mb-2 font-space bg-transparent border-2 border-slate-400 hover:border-slate-200 text-md text-slate-400 placeholder:text-slate-600 rounded transition-all duration-300 ease-in-out" type="text" placeholder="username" value={username} onChange={e => setUsername(e.target.value)} required/>
						<button className="h-8 font-space text-slate-400 bg-slate-600" type="submit">
							submit
						</button>
					</div>
				</form> 
				<button 
					className="w-[260px] h-[80px] sm:h-[64px] bg-transparent border-2 border-slate-400 hover:border-slate-200 text-md text-slate-400 hover:text-slate-200 font-space rounded transition-all duration-700 ease-in-out"
					onClick={event =>  window.location.href=url.toString()}> {/*on click redirect to backend auth/login*/}
						Log in with 42 account
				</button>
			</div>
			<Footer/>
		</>
	);

}

export default Logging