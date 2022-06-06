import React, { useState, useEffect } from 'react'

// Components
import Home from './Home';

// Hooks
import { useSelector } from 'react-redux';
//socket
import { SocketContext, socket} from '../../../context/socket';
import { Navigate, useSearchParams } from 'react-router-dom';

const Root = () => {
	const global = useSelector((state: any) => state.global)
	const [searchParams, setSearchParams] = useSearchParams();
	const [validLogin, setValidLogin] = useState(false);
	const jwt = searchParams.get("jwt") == null ? global.token : searchParams.get("jwt");

	if (validLogin == false){
		const requestOptions = {
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json;charset=utf-8',
			  'Access-Control-Allow-Origin': '*',
			},
			body: JSON.stringify({jwt: jwt})
		}
		fetch("http://localhost:5000/auth/validToken", requestOptions)
		.then(async response=>{
			if (response.ok){
				setValidLogin(current => !current);
			}
		})
	}
	if (validLogin) {
		return(
			<SocketContext.Provider value={socket}>
				<Home />
			</SocketContext.Provider>
		)
	}
	return <Navigate to="/login" replace />

}

export default Root


/*
import React from 'react'

// Components
import Logging from './Logging';
import Home from './Home';

// Hooks
import { useSelector } from 'react-redux';
//socket
import { SocketContext, socket} from '../../../context/socket';
import { useSearchParams } from 'react-router-dom';
const Root = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	console.log(searchParams, searchParams.get("lol"))
	const global = useSelector((state: any) => state.global)
	document.title = global.username === undefined ? "Login" : global.username;
	return (
		<>
				{global.logged === false ? 
					<Logging/>
					:
					<SocketContext.Provider value={socket}>
						<Home />
					</SocketContext.Provider>
				}
		</>
	);
}

export default Root
*/