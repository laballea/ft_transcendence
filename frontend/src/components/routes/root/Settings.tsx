import React from 'react'

// Components
import NavBar from '../../navbar/NavBar'
import Footer from '../../commons/footer/Footer';
import ContactList from '../../contactList/ContactList';
import SettingsProfile from '../../settings/SettingsProfile';
import Settings2FA from '../../settings/Settings2FA';

// CSS
import '../../../assets/fonts/fonts.css';

// Redux
import { useSelector } from 'react-redux';
import SocialInterface from '../../commons/socialInterface/SocialInterface';

// Assets
type SettingsProps = {

}

// eslint-disable-next-line
const Settings = ({} : SettingsProps) => {
	const global = useSelector((state: any) => state.global)
	return (
		<div className="w-full h-screen relative bg-slate-900">
			<NavBar/>
			<div className="absolute flex justify-between
							w-full top-[80px] sm:top-[112px] bottom-0 sm:bottom-[48px]">
				<div className="w-[calc(100%-400px)] h-full flex sm:block justify-between z-10 p-[40px] overflow-scroll">
					<div className=''>
						<SettingsProfile username={global.username} userImage={global.userImage}/>
						<Settings2FA/>
					</div>
				</div>
				<SocialInterface/>
			</div>
			<Footer/>
		</div>
	)
}

Settings.defaultProps = {
}

export default Settings