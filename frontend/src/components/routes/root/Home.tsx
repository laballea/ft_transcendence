import React from 'react'

// Components
import NavBar from '../../navbar/NavBar'
import ContactList from '../../contactList/ContactList';
import Footer from '../../commons/footer/Footer';


export default function Home() {
	
	return (
		<div className="w-full h-screen relative bg-slate-900">
			<NavBar/>
			<div className="absolute top-[112px] bottom-[80px] flex w-full ">
				<main className="w-full">
				</main>
				<aside>
					<ContactList/>
				</aside>
			</div>
			<Footer/>
		</div>
	)
}