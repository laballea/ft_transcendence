import React, { useState, useEffect } from 'react'

// Components
import Home from './Home';
// Hooks
import { useSelector } from 'react-redux';
//socket
import { SocketContext, socket} from '../../../context/socket';
import { Navigate } from 'react-router-dom';

const Root = () => {
	const global = useSelector((state: any) => state.global)
	return (
		<>
			{global.logged ?
				<SocketContext.Provider value={socket}>
					<Home/>
				</SocketContext.Provider>
				:
				<Navigate to="/login" replace />
			}
		</>
	)
}

export default Root
