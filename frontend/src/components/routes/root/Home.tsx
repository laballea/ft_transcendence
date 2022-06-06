import React, {useContext, useEffect} from 'react'

// Components
import NavBar from '../../navbar/NavBar'
import ContactList from '../../contactList/ContactList';
import Footer from '../../commons/footer/Footer';

// CSS
import '../../../assets/fonts/fonts.css';

//Socket
import { SocketContext } from '../../../context/socket';

//Redux
import { useSelector, useDispatch } from 'react-redux';
import { updateDB } from '../../../store/global/reducer';

export default function Home() {
	const socket = useContext(SocketContext);
	const global = useSelector((state: any) => state.global)
	document.title = global.username === undefined ? "Login" : global.username;
	const dispatch = useDispatch();
	useEffect(() => {
		socket.emit("CONNECT", {socketID: socket.id, id:global.id, username:global.username}); 
		socket.on("UPDATE_DB", (data) => {
			dispatch(updateDB(data));
		});
		return () => {
		  // before the component is destroyed
		  // unbind all event handlers used in this component
		  socket.off('CONNECT');
		  socket.off('RECEIVE_REQUEST');
		};
	  }, [socket, dispatch, global]);
	return (
		<div className="w-full h-screen relative bg-slate-900">
			<NavBar/>
			<div className="absolute flex justify-between
							w-full top-[80px] sm:top-[112px] bottom-0 sm:bottom-[48px]">
				<main className="hidden sm:block w-[100px]">
				</main>
				<ContactList/>
			</div>
			<Footer/>
		</div>
	)
}