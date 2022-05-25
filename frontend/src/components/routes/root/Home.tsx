import React from 'react'

// Components
import NavBar from '../../navbar/NavBar'
import ContactList from '../../contactList/ContactList';
import HomeContent from '../../contactList/ContactList';
import Footer from '../../commons/footer/Footer';


export default function Home() {
	
	return (
		<>
			<NavBar/>
			<div>
				<HomeContent/>
				<ContactList/>
			</div>
			<Footer/>
		</>
	)
}