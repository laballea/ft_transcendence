import React from 'react'
// Components
import IconButton from 	'../commons/buttons/IconButton'

// Assets
import {FiSettings, FiLogOut} from 'react-icons/fi'
import defaultUserImage from '../../assets/images/default-user.png'

type NavProfileProps = {
	username: string,
	userImage: string,
	onClickSettings: () => void,
	onClickLogOut: () => void,
	onClickProfile: () => void,
}

const NavProfile = ({username, userImage, onClickLogOut, onClickProfile} : NavProfileProps) => {

	const [showMenu, setShowMenu] = React.useState(false);

	return (
		<>
		{/* Desktop Profile Menu */}
			<div className="hidden sm:flex items-center sm:w-[400px]">
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
					<IconButton icon={FiSettings}></IconButton>
					<IconButton icon={FiLogOut}></IconButton>
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
				{ showMenu ? 
				<div className="absolute left-0 top-[80px] w-full h-full bg-slate-800" >

				</div> : null }
			</div>
		</>
	)
}

NavProfile.defaultProps = {
	username: 'username',
	userImage: defaultUserImage,
	onClickSettings: () => { console.log("onClickSettings")},
	onClickLogOut: () => { console.log("onClickLogOut")},
	onClickProfile: () => { console.log("onClickLogOut")},
}

export default NavProfile
