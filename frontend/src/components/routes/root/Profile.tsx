import React from 'react'

// Components
import NavBar from '../../navbar/NavBar'
import Footer from '../../commons/footer/Footer';
import ContactList from '../../contactList/ContactList';

// CSS
import '../../../assets/fonts/fonts.css';

// Assets
import defaultUserImage from '../../../assets/images/default-user.png'

type ProfileProps = {
	username: string,
	userImage: string,
}

const Profile = ({username, userImage} : ProfileProps) => {
	
	return (
		<div className="w-full h-screen relative bg-slate-900">
			<NavBar/>
			<div className="absolute flex justify-between
							w-full top-[80px] sm:top-[112px] bottom-0 sm:bottom-[48px]">
				<div className="w-[calc(100%-400px)] h-full flex sm:block justify-between z-50 p-[40px]">
					<div className=''>
						<div className='flex items-center'>
							<img src={userImage} width="200" height="200" alt="userimage" className="rounded-full mr-[200px]"></img>
							<div >
							<h2 className='font-bold bold text-[64px] text-transparent backgroundTextOutline'>{username}</h2>
							</div>
						</div>
						<div  className='w-full border-t-2 border-slate-700'>
							<h2 className='font-pilowlava text-[64px] text-transparent backgroundTextOutline'>Stats</h2>
							<p className="text-slat">No Games played yet</p>
						</div>
						<div  className='w-full border-t-2 border-slate-700'>
							<h2 className='font-pilowlava text-[64px] text-transparent backgroundTextOutline'>History</h2>
							<p className="text-slat">No Games played yet</p>
						</div>
					</div>
				</div>
				<ContactList/>
			</div>
			<Footer/>
		</div>
	)
}


Profile.defaultProps = {
	username: 'username',
	userImage: defaultUserImage,
}


export default Profile