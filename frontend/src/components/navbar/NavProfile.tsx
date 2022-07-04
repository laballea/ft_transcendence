import React from 'react'
// Components
import IconButton from 	'../commons/buttons/IconButton'
import MobileMenuButton from '../commons/buttons/MobileMenuButton'

// Assets
import {FiSettings, FiLogOut, FiMessageCircle, FiUser, FiHome} from 'react-icons/fi'
import defaultUserImage from '../../assets/images/default-user.png'

type NavProfileProps = {
	username: string,
	userImage: string,
	onClickSettings: () => void,
	onClickLogOut: () => void,
	onClickProfile: () => void,
	onClickHome: () => void,
	onClickMessage: () => void,
}

const NavProfile = ({username, userImage, onClickSettings, onClickLogOut, onClickProfile, onClickHome} : NavProfileProps) => {
	const [showMenu, setShowMenu] = React.useState(false);
	return (
		<>
		{/* Desktop Profile Menu */}
			<div className="hidden sm:flex items-center sm:w-[376px]">
				<div className="flex justify-end sm:justify-start items-center mr-[8px] font-space
								text-slate-400 hover:text-slate-200 text-[20px]
								transition-all duration-300 ease-in-out
								cursor-pointer
								"
					onClick={onClickProfile}>
					<img src={userImage} width="40" height="40" alt="userimage" className="rounded-full mr-[8px]"></img>
					<p className="sm:block hidden">
						{username}
					</p>
				</div>
				<div className="hidden sm:flex items-center">
					<IconButton icon={FiSettings} onClick={onClickSettings}></IconButton>
					<IconButton icon={FiLogOut} onClick={onClickLogOut}></IconButton>
				</div>
			</div>
		{/* // Desktop Mobile Menu */}
			<div className="block sm:hidden 
							transition-all duration-300 ease-in-out
							cursor-pointer" 
				onClick={() => setShowMenu(!showMenu)}>
				<div>
					<img src={userImage} width="40" height="40" alt="userimage" className="rounded-full mr-[8px]"></img>
				</div>
				{ showMenu 
					? 
					<div className="flex flex-col justify-between items-stretch z-10
									absolute left-0 top-[80px] w-full h-[calc(100vh-90px)] bg-slate-800" >
						<div>
							<MobileMenuButton cta="Home"		icon={FiHome}			onClick={onClickProfile} />
							<MobileMenuButton cta="Profile"		icon={FiUser}			onClick={onClickProfile} />
							<MobileMenuButton cta="Message"		icon={FiMessageCircle}	onClick={onClickMessage} />
							<MobileMenuButton cta="Settings"	icon={FiSettings}		onClick={() => {}} />
						</div>
						<div>
							<MobileMenuButton cta="Log Out"		icon={FiLogOut}			onClick={onClickLogOut} logout={true}/>
						</div>
					</div> 
					: 
					null 
				}
			</div>
		</>
	)
}

NavProfile.defaultProps = {
	username: 'username',
	userImage: defaultUserImage,
	onClickSettings: () => { console.log("onClickSettings")},
	onClickLogOut: () => { console.log("onClickLogOut")},
	onClickProfile: () => { console.log("onClickProfile")},
	onClickHome: () => { console.log("onClickHome")},
	onClickMessage: () => { console.log("onClickMessage")},
}

export default NavProfile
