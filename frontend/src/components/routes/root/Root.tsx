import React from 'react'

// Components
import Logging from './Logging';
import Home from './Home';

// Hooks
import { useSelector } from 'react-redux';

const Root = () => {
	const global = useSelector((state: any) => state.global)
	document.title = global.username ===undefined ? "Login" : global.username;
	return (
		<>
			{global.logged === false ? <Logging/> : <Home /> }
		</>
	);
}

export default Root
