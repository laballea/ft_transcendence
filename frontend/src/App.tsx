import React from 'react'

// Components
import Profile from './components/routes/root/Profile';
import Root from './components/routes/root/Root';

// Hooks
import {
	BrowserRouter as Router,
	Routes,
	Route 
} from "react-router-dom";

function App() {

	return (
		<Router>
			<div className="bg-slate-900 w-screen h-screen">
				<Routes>
					<Route path="/" element={<Root/>}/>
					<Route path="/Profil" element={<Profile/>}/>
				</Routes>
			</div>
		</Router>
	);
}



export default App;
