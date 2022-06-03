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
import { useSelector } from 'react-redux';

export default function Home() {
	const socket = useContext(SocketContext);
	const global = useSelector((state: any) => state.global)

	useEffect(() => {
		// as soon as the component is mounted, do the following tasks:
	
		// emit USER_ONLINE event
		socket.on('connect', () => {
			socket.emit("CONNECT", {socketID: socket.id, id:global.id}); 
		 });
	
		return () => {
		  // before the component is destroyed
		  // unbind all event handlers used in this component
		  socket.off('connect');
		};
	  }, [socket]);
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