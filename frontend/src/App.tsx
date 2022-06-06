import React from 'react'

// Components
import Profile from './components/routes/root/Profile';
import Root from './components/routes/root/Root';
import Logging from './components/routes/root/Logging';
import { useSelector } from 'react-redux';
// Hooks
import {
	BrowserRouter as Router,
	Routes,
	Route, 
	Navigate,
} from "react-router-dom";

function App() {
	const global = useSelector((state: any) => state.global)

	return (
		<Router>
			<div className="bg-slate-900 w-screen h-screen">
				<Routes>
				<Route path="/" element={<Navigate to="/login" replace />}/>

					<Route path="/login" element={<Logging/>}/>
					<Route path="/home" element={<Root/>}/>
					<Route path="/home/profile" element={<Profile/>}/>
				</Routes>
			</div>
		</Router>
	);
}

export default App;
