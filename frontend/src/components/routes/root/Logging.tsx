import React, { useState } from 'react'

// Components
import BackgroundLogging from '../../commons/backgrounds/BackgroundLogging';
import Footer from '../../commons/footer/Footer';
// Hooks
import { login } from '../../../store/global/reducer'
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Popup from 'reactjs-popup'; 
import { useDispatch } from 'react-redux';
import PopUpToaster from '../../commons/popup/PopUpToaster';

const Logging = () => {
	const [username, setUsername] = useState("");

	const code2faInitialState = {
		pin1: "",
		pin2: "",
		pin3: "",
		pin4: "",
		pin5: "",
		pin6: "",
	}

	const [code2fa, setCode] = useState(code2faInitialState);
	const dispatch = useDispatch();
	const [popup, setPopup] = useState({open:false, error:true, message:""});
	const navigate = useNavigate();
	console.log(process.env);
	const urlIntra = new URL(`${process.env.REACT_APP_BACK_IP}/auth/intra`); //url for intra auth
	const urlGoogle = new URL(`${process.env.REACT_APP_BACK_IP}/auth/google`); //url for google auth
	const urlDiscord = new URL(`${process.env.REACT_APP_BACK_IP}/auth/discord`); //url for discord auth
	const [searchParams, setSearchParams] = useSearchParams();
	const jwt = searchParams.get("jwt") == null ? null : searchParams.get("jwt"); // get jwt token on query
	const id = searchParams.get("id") == null ? null : searchParams.get("id"); // get jwt token on query
	var twofa = searchParams.get("2fa") == null ? null : searchParams.get("2fa");
	document.title = "login";

	React.useEffect(() => {
		if (popup.open) {
			setTimeout(() => {
				setPopup(current => {return {open:!current.open, error:true, message:""}})
			}, 2000);
		}
	  }, [popup]);

	const validToken = (token:string) => {
		const requestOptions = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
				'Access-Control-Allow-Origin': '*',
				'Authorization': 'bearer ' + token,
			},
		}
		fetch(`${process.env.REACT_APP_BACK_IP}/auth/user`, requestOptions)
		.then(async response=>{
			let resp = await response.json();
			if (response.ok){
				navigate('/app')
				dispatch(login({user:resp.user, token:resp.token}))
			}
			else {
				if (searchParams.get("jwt")){
					searchParams.delete("jwt");
					setSearchParams(searchParams);
				}
				setPopup({open:true, error:true, message:resp.message})
			}
		})
	}

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
		fetch(`${process.env.REACT_APP_BACK_IP}/auth/login`, requestOptions)
		.then(async response=>{
			const resp:any = await response.json()
			if (response.ok){
				validToken(resp.token)
			} else {
				setPopup({open:true, error:true, message:resp.message})
			}
		})
	}

	const handleCode = async (event: any) => {

		const concatCode :string = code2fa.pin1 + code2fa.pin2 + code2fa.pin3 + code2fa.pin4 + code2fa.pin5 + event.target.value
		
		event.preventDefault();// Prevent page reload
		const requestOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
				'Access-Control-Allow-Origin': '*',
				//'Authorization': 'bearer ' + jwt,w-[64px] h-[80px]
			},
			body: JSON.stringify({
				code: concatCode,
				id:id
			})
		}
		fetch(`${process.env.REACT_APP_BACK_IP}/2fa/authenticate`, requestOptions)
		.then(async response=>{
			const resp:any = await response.json()
			if (response.ok){
				validToken(resp.token)
			} else {
				setCode(code2faInitialState)
				// setPopup({open:true, error:true, message:resp.message})
	
			}
		})
	}
	
	React.useEffect(() => {
		let firstInput = document.getElementById('pin1');
		if(firstInput !== null){
			firstInput.focus();
		}
	},[]);
	
	
	if (id && twofa) {
		for (const [key, value] of Object.entries(code2fa)) {
			
			if (value === "")
			{
				let nextSibiling = document.getElementById(`${key}`);
	
				if(nextSibiling !== null){
					nextSibiling.focus();
					break;
				}
			}
		}


		return (
		<div className='w-full h-full flex items-center justify-center '>
			<div>
				
				<form className="relative z-10 w-[472px]">
					<label className='absolute top-[-32px] font-space text-slate-500'>Enter your 2FA code here: </label>
					<div className='flex items-center justify-center gap-[16px]'>
						<input className='w-[64px] h-[80px] border-2 border-slate-700
											bg-transparent text-center
											font-space text-[72px] text-slate-300' 
								onChange={e => {
									setCode({...code2fa, pin1 : e.target.value})
									
								}}
								value={code2fa.pin1}
								tabIndex={1}
								type="tel" id="pin1" maxLength={1} pattern="[\d]*" placeholder="·" autoComplete="off"  required></input>
						<input className='w-[64px] h-[80px] border-2 border-slate-700
											bg-transparent text-center
											font-space text-[72px] text-slate-300' 
								onChange={e => {
									setCode({...code2fa, pin2 : e.target.value})
									
								}}
								value={code2fa.pin2}
								tabIndex={2}
								type="tel" id="pin2" maxLength={1} pattern="[\d]*" placeholder="·" autoComplete="off"  required></input>
						<input className='w-[64px] h-[80px] border-2 border-slate-700
											bg-transparent text-center
											font-space text-[72px] text-slate-300' 
								onChange={e => {
									setCode({...code2fa, pin3 : e.target.value})
									
								}}
								value={code2fa.pin3}
								tabIndex={3}
								type="tel" id="pin3" maxLength={1} pattern="[\d]*" placeholder="·" autoComplete="off"  required></input>
						<input className='w-[64px] h-[80px] border-2 border-slate-700
											bg-transparent text-center
											font-space text-[72px] text-slate-300' 
								onChange={e => {
									setCode({...code2fa, pin4 : e.target.value})
									
								}}
								value={code2fa.pin4}
								tabIndex={4}
								type="tel" id="pin4" maxLength={1} pattern="[\d]*" placeholder="·" autoComplete="off"  required></input>
						<input className='w-[64px] h-[80px] border-2 border-slate-700
											bg-transparent text-center
											font-space text-[72px] text-slate-300' 
								onChange={e => {
									setCode({...code2fa, pin5 : e.target.value})
									
								}}
								value={code2fa.pin5}
								tabIndex={5}
								type="tel" id="pin5" maxLength={1} pattern="[\d]*" placeholder="·" autoComplete="off"  required></input>
						<input className='w-[64px] h-[80px] border-2 border-slate-700
											bg-transparent text-center
											font-space text-[72px] text-slate-300' 
								onChange={e => {
									handleCode(e)
								}}
								value={code2fa.pin6}
								tabIndex={6}
								type="tel" id="pin6" maxLength={1} pattern="[\d]*" placeholder="·" autoComplete="off"  required></input>
					</div>
					<input type="submit" hidden />
					{/* <button className="text-white" type="submit">
						Send
					</button> */}
				</form>
			</div>
			<Popup open={popup.open} contentStyle={{position:'absolute', bottom:0, left:0}}>
				<PopUpToaster content={popup.message}/>
			</Popup>
		</div>
		)
	} else if (jwt){ // if token exist in redux user is already logged
		validToken(jwt)
	}

	return (
		<>
			<BackgroundLogging/>
			<div className="absolute w-screen h-screen flex flex-col justify-center items-center">
				{/* <form onSubmit={handleSubmit}>			
					<div className="flex flex-col mb-[40px]">
						<label className="font-space text-slate-400 text-xs" >test-login:</label>
						<input className="h-8 w-[260px] p-4 mb-2 font-space bg-transparent border-2 border-slate-400 hover:border-slate-200 text-md text-slate-400 placeholder:text-slate-600 rounded transition-all duration-300 ease-in-out"
							type="text"
							pattern="[A-Za-z0-9]+"
							title="No whitespace."
							placeholder="username"
							value={username}
							onChange={e => setUsername(e.target.value)} required
						/>
						<button className="h-8 font-space text-slate-400 bg-slate-600" type="submit">
							submit
						</button>
					</div>
				</form> 
				<button 
					className="w-[260px] m-3 h-[80px] sm:h-[64px] bg-transparent border-2 border-slate-400 hover:border-slate-200 text-md text-slate-400 hover:text-slate-200 font-space rounded transition-all duration-700 ease-in-out"
					onClick={event =>  window.location.href=urlIntra.toString()}>
						42 account
				</button> */}
				<button 
					className="w-[260px] m-3 h-[80px] sm:h-[64px] bg-transparent border-2 border-slate-400 hover:border-slate-200 text-md text-slate-400 hover:text-slate-200 font-space rounded transition-all duration-700 ease-in-out"
					onClick={event =>  window.location.href=urlGoogle.toString()}>
						Google account
				</button>
				<button 
					className="w-[260px] m-3 h-[80px] sm:h-[64px] bg-transparent border-2 border-slate-400 hover:border-slate-200 text-md text-slate-400 hover:text-slate-200 font-space rounded transition-all duration-700 ease-in-out"
					onClick={event =>  window.location.href=urlDiscord.toString()}>
						Discord account
				</button>
				<Popup open={popup.open} contentStyle={{position:'absolute', bottom:0, left:0}}>
					<PopUpToaster content={popup.message}/>
				</Popup>
			</div>
			<Footer/>
		</>
	);

}

export default Logging