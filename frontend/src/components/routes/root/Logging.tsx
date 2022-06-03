import React, { useState } from 'react'

// Components
import BackgroundLogging from '../../commons/backgrounds/BackgroundLogging';
import Footer from '../../commons/footer/Footer';
// Hooks
import { useDispatch } from 'react-redux'
import { login } from '../../../store/global/reducer'


const Logging = () => {
	const [username, setUsername] = useState("");
	const dispatch = useDispatch()

	const url = new URL("https://api.intra.42.fr/oauth/authorize?client_id=254ee9c51d283d7911364b29f60d76fd8b47354cf9de36ed2edc9ae2d65e1136&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fauth%2Flogin&response_type=code");
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
			})
		}
		fetch("http://localhost:5000/auth/login", requestOptions)
		.then(async response=>{
			if (response.ok){
				const resp:any = await response.json()
				console.log(resp.user);
				dispatch(login({user:resp.user, token:resp.token}))
			}
			else {
				console.log(response);
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
					onClick={event =>  window.location.href=url.toString()}>
						Log in with 42 account
				</button>
			</div>
			<Footer/>
		</>
	);

}

export default Logging