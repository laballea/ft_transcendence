import React from 'react'

// Components
import Logging from './Logging';
import Home from './Home';

// Hooks
import { useSelector } from 'react-redux';
//socket
import { SocketContext, socket} from '../../../context/socket';

const Root = () => {
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
