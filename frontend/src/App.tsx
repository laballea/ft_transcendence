import React from 'react'
import  { Router, Link } from 'react-router-dom'
import logo from './logo.svg';
import './App.css';

function Loggin(){ 
	const url = new URL("https://api.intra.42.fr/oauth/authorize");
	url.searchParams.append('client_id', "9384000c12d958f2a599467c2bd482b25cbb0ae8e588e3b3382720ff3d290d02");
	url.searchParams.append('redirect_uri', "http://localhost/");
	url.searchParams.append('state', "bonjour je m'appelle pas");
	url.searchParams.append('response_type', "code");
	return (
		<button onClick={event =>  window.location.href=url.toString()}>Log in 42</button>
	)
}

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<Loggin/>
			</header>
		</div>
	);
}

export default App;
