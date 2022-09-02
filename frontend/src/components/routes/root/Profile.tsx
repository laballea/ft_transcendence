import React, {useState, useEffect} from 'react'

// Components
import NavBar from			'../../navbar/NavBar'
import Footer from			'../../commons/footer/Footer';
import ContactList from		'../../contactList/ContactList';
import ProfileInfos from	'../../profile/ProfileInfos';
import ProfileHistory from	'../../profile/ProfileHistory';
import ProfileStats from	'../../profile/ProfileStats';
import ProfileActions from	'../../profile/ProfileActions';

// CSS
import '../../../assets/fonts/fonts.css';

// Assets
import defaultUserImage from '../../../assets/images/default-user.png'

// Types
import { status } from '../../../common/types'

import { useLocation } from "react-router-dom";
import Loading from '../../commons/utils/Loading';

type ProfileProps = {
	contact: {
		username:string,
		id:number,
		status:status,
	},
	userImage: string,
}

const Profile = ({contact, userImage} : ProfileProps) => {
	const param:any = useLocation()
	const id = param.state !== null ? param.state.id : contact.id
	const [user, setUser] = useState(null)

	var eventSource:EventSource;

	useEffect(() => {
		// eslint-disable-next-line
		eventSource = new EventSource('http://localhost:5000/users/gameStat?id=' + id);

		eventSource.onmessage = ({ data }) => {
			const json = JSON.parse(data)
			setUser(prevState => (json.gameStats))
		}
		return () => {
			eventSource.close()
		};
	}, [id]);



	return (
		<div className="w-full h-screen relative bg-slate-900">
			<NavBar/>
			<div className="absolute flex justify-between
							w-full top-[80px] sm:top-[112px] bottom-0 sm:bottom-[48px]">
				
				<div className="w-[calc(100%-400px)] overflow-scroll h-full flex sm:block justify-between z-10 p-[40px]">
					{
							user && id ?
							<div className=''>
							<ProfileActions contact={user}/>
							<ProfileInfos	contact={user} userImage={userImage}/>
							<ProfileHistory	contact={user}/>
							<ProfileStats	contact={user}/>
							</div>
							:
							<div className='flex items-center justify-center w-full h-full'>
								<Loading/>
							</div>
					}
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