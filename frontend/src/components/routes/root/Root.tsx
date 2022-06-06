import React, { useState, useEffect } from 'react'

// Components
import Home from './Home';

// Hooks
import { useDispatch, useSelector } from 'react-redux';
//socket
import { SocketContext, socket} from '../../../context/socket';
import { Navigate, useSearchParams } from 'react-router-dom';
import { login } from '../../../store/global/reducer';
export enum loginStatus {
	waiting = 'WAITING',
	valid = 'VALID',
	invalid = 'INVALID',
}

const Root = () => {
	const global = useSelector((state: any) => state.global)
	const dispatch = useDispatch();
	const [searchParams, setSearchParams] = useSearchParams();
	const jwt = searchParams.get("jwt") == null ? global.token : searchParams.get("jwt"); // get jwt token on query

	/*
		GET method on /auth/user with jwt auth
		backend respond with user data or unauthaurized
		if succeed we update redux store with user data and remove query from url
		else we redirect to login page
	*/
	if (global.token != jwt){ // if token exist in redux user is already logged
		const requestOptions = {
			method: 'GET',
			headers: {
			  'Content-Type': 'application/json;charset=utf-8',
			  'Access-Control-Allow-Origin': '*',
			  'Authorization': 'bearer ' + jwt,
			},
		}
		fetch("http://localhost:5000/auth/user", requestOptions)
		.then(async response=>{
			let user = await response.json();
			if (response.ok){
				dispatch(login({user:user, token:jwt}))
				if (searchParams.get("jwt")){
					searchParams.delete("jwt");
					setSearchParams(searchParams);
				}
			}
		})
	}
	return (
		<>
			{(function() {
				if (global.logged) {
					return (
						<SocketContext.Provider value={socket}>
							<Home/>
						</SocketContext.Provider>
					);
				} else{
					return <Navigate to="/login" replace />
				}
		 	 })()} 
		</>
	)
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