import React from 'react'

// Components
import NavBar from			'../../navbar/NavBar'
import Footer from			'../../commons/footer/Footer';
import ContactList from		'../../contactList/ContactList';
import ProfileInfos from	'../../profile/ProfileInfos';
import ProfileHistory from	'../../profile/ProfileHistory';
import ProfileStats from	'../../profile/ProfileStats';

// CSS
import '../../../assets/fonts/fonts.css';

// Assets
import defaultUserImage from '../../../assets/images/default-user.png'

// Types
import { status } from '../../../common/types'

type ProfileProps = {
	contact: {
		username:string,
		id:number,
		status:status,
	},
	userImage: string,
}

const Profile = ({contact, userImage} : ProfileProps) => {
	
	return (
		<div className="w-full h-screen relative bg-slate-900">
			<NavBar/>
			<div className="absolute flex justify-between
							w-full top-[80px] sm:top-[112px] bottom-0 sm:bottom-[48px]">
				<div className="w-[calc(100%-400px)] h-full flex sm:block justify-between z-50 p-[40px]">
					<div className=''>
						<ProfileInfos	contact={contact} userImage={userImage}/>
						<ProfileHistory	contact={contact}/>
						<ProfileStats	contact={contact}/>
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