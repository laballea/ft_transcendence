import React from 'react'
import Logging from './components/logging';
import Home from './components/home';
import Profil from './components/profil';
import { useSelector } from 'react-redux';
import {
	BrowserRouter as Router,
	Routes,
	Route } from "react-router-dom";
import './App.css';

function App() {

	return (
		<Router>
			<div className="App">
				<Routes>
					<Route path="/Profil" element={<Profil/>}/>
					<Route path="/" element={<Main/>}/>
				</Routes>
			</div>
		</Router>
	);
}

function Main() {
	const global = useSelector((state: any) => state.global)
	document.title = global.username ===undefined ? "Login" : global.username;
	return (
		<>
			{global.logged === false ?
				<Logging/>
				:
				<Home />
			}
		</>
	);
  }
  

export default App;
