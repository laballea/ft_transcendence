import React from 'react'
import Header from '../../commons/navbar/NavBar'
import ContactList from '../../contactList/ContactList';
export default function Home() {
	
	return (
		<>
			<div className='header'>
				<Header/>
			</div>
			<div className='contactList'>
				<ContactList/>
			</div>
		</>
	)
}