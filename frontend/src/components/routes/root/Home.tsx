import React, {useContext, useEffect, useState} from 'react'

// Components
import NavBar from '../../navbar/NavBar'
import ContactList from '../../contactList/ContactList';
import Message from '../../message/index';
import Footer from '../../commons/footer/Footer';

// CSS
import '../../../assets/fonts/fonts.css';

//Socket
import { SocketContext } from '../../../context/socket';

//Redux
import { useSelector, useDispatch } from 'react-redux';
import { updateDB } from '../../../store/global/reducer';
import Popup from 'reactjs-popup'; 
import PopUpWindow from '../../commons/popup/PopUpWindow';

export default function Home() {
	const socket = useContext(SocketContext);
	const global = useSelector((state: any) => state.global)
	const [popup, setPopup] = useState({open:false, error:true, message:""});
	document.title = global.username;
	const dispatch = useDispatch();

	useEffect(() => {
		socket.emit("CONNECT", {socketID: socket.id, id:global.id, username:global.username}); 
		socket.on("UPDATE_DB", (data) => {
			dispatch(updateDB(data));
		});
		socket.on("PopUp", (data) => {
			setPopup({open:true, error:data.error, message:data.message})
		});
		return () => {
			// before the component is destroyed
			// unbind all event handlers used in this component
			socket.off('CONNECT');
			socket.off('RECEIVE_REQUEST');
		};
	}, []);
	React.useEffect(() => {
		if (popup.open) {
			setTimeout(() => {
				setPopup(current => {return {open:!current.open, error:true, message:""}})
			}, 2000);
		}
	}, [popup]);
	return (
		<div className="w-full h-screen relative bg-slate-900">
			<NavBar/>
			<div className="absolute flex justify-between
							w-full top-[80px] sm:top-[112px] bottom-0 sm:bottom-[48px]">
				<main className="hidden sm:block w-[100px]">
				</main>
				<ContactList/>
			</div>
			<div className="absolute flex justify-between">
				<Message/>
			</div>
			<Footer/>
			<Popup open={popup.open} contentStyle={{position:'absolute', bottom:0, left:0}}>
				<PopUpWindow content={popup.message} error={popup.error}/>
			</Popup>
		</div>
	)
}