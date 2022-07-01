import React, { useState, useEffect, useContext } from 'react'

// Components
import Home from './Home';

// Hooks
import {useDispatch, useSelector } from 'react-redux';
import { logout, updateDB, gameFound, gameEnd } from '../../../store/global/reducer';

//socket
import { SocketContext, socket} from '../../../context/socket';
import { Navigate, Routes, Route } from 'react-router-dom';
import Profile from './Profile';
import Popup from 'reactjs-popup'; 
import PopUpWindow from '../../commons/popup/PopUpWindow';
import Message from './Message';

const SocketConnection = (props:any) => {
	const socket = useContext(SocketContext);
	const dispatch = useDispatch();
	const global = useSelector((state: any) => state.global)
	const [popup, setPopup] = useState({open:false, error:true, message:""});
	React.useEffect(() => {
		if (popup.open) {
			let msg = popup.message
			setTimeout(() => {
				if (msg === popup.message)
					setPopup(current => {return {open:false, error:true, message:""}})
			}, 2000);
		}
	}, [popup]);
	useEffect( () => {
		if (socket.connected === false)
			socket.connect()
			socket.on("connect", () => {
				socket.emit("CONNECT", {socketID: socket.id, id:global.id, username:global.username});
				socket.on("UPDATE_DB", (data) => {
					dispatch(updateDB(data))
				});
				socket.on("PopUp", (data) => {
					setPopup({open:true, error:data.error, message:data.message})
				});
				socket.on("disconnect", (data) => {
					dispatch(logout())
				});
				socket.on("GAME_FOUND", (data) => {
					dispatch(gameFound(data))
				});
				socket.on("GAME_END", () => {
					dispatch(gameEnd())
				});
			});
		
		return () => {
			socket.off('connect')
			socket.off('disconnect')
			socket.off('CONNECT')
			socket.off('RECEIVE_REQUEST')
			socket.off("GAME_FOUND")
			socket.off("GAME_END")
			socket.off("PopUp")
			socket.off("UPDATE_DB")
			socket.disconnect()
		};
	// eslint-disable-next-line
	}, []);
	return (
		<>
			<Routes>		
				<Route path="/" element={<Home/>}/>
				<Route path="/profile" element={<Profile/>}/>
				<Route path="/message" element={<Message/>}/>
			</Routes>
			<Popup open={popup.open} contentStyle={{position:'absolute', bottom:0, left:0}}>
				<PopUpWindow content={popup.message} error={popup.error}/>
			</Popup>
		</>
	)
}

const Root = () => {
	const global = useSelector((state: any) => state.global)
	return (
		<>
			{global.logged ?
				<SocketContext.Provider value={socket}>
					<SocketConnection/>
				</SocketContext.Provider>
				:
				<Navigate to="/login" replace />
			}
		</>
	)
}

export default Root