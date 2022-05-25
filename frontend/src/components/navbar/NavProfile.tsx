import React from 'react'
// Components
import IconButton from 	'../commons/buttons/IconButton'

// Assets
import {FiSettings, FiLogOut} from 'react-icons/fi'
import defaultUserImage from '../../assets/images/defaultUserImage.png'


type NavProfileProps = {
	username: string,
	userImage: string
}

const NavProfile = ({username, userImage} : NavProfileProps) => {
	return (
		<div className="flex items-center w-[400px]">
			<img src={userImage} alt="userimage" className="w-[40px] h-[40px]"></img>
			<p className="text-space text-[20px] text-slate-400 h:text-slate-200 mr-[8px]">
				{username}
			</p>
			<IconButton icon={FiSettings}></IconButton>
			<IconButton icon={FiLogOut}></IconButton>
		</div>
		
	)
}

NavProfile.defaultProps = {
	username: 'username',
	userImage: {defaultUserImage},
}

export default NavProfile
