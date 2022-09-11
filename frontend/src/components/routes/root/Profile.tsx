import React, {useState, useEffect} from 'react'

// Components
import NavBar from			'../../navbar/NavBar'
import Footer from			'../../commons/footer/Footer';
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
import SocialInterface from '../../commons/socialInterface/SocialInterface';
import { useSelector } from 'react-redux';

type ProfileProps = {
	contact: {
		username:string,
		id:number,
		status:status,
	},
}

const Profile = ({contact} : ProfileProps) => {
	const global = useSelector((state: any) => state.global)
	const param:any = useLocation()
	const id = param.state !== null ? param.state.id : contact.id
	const [user, setUser] = useState(null)
	const [loading, setLoading] = useState(true)

	const getGame = () => {
		const requestOptions = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
				'Access-Control-Allow-Origin': '*',
				'Authorization': 'bearer ' + global.token,
			},
		}
		fetch(`http://${process.env.REACT_APP_ip}:5000/users/gameStat?id=` + id, requestOptions)
		.then(async resp=>{
			let json = await resp.json();
			setUser(prevState => (json))
			setLoading(false)
		})
	}

	useEffect(() => {
		setLoading(true)
		let inter = setInterval(getGame, 1000);
		return () => {
			clearInterval(inter)
		};
	// eslint-disable-next-line
	}, [id]);
	return (

		<div className="w-full h-screen relative bg-slate-900">
			<NavBar/>
			<div className="absolute flex justify-between
							w-full top-[80px] sm:top-[112px] bottom-0 sm:bottom-[48px]">
				
				<div className="w-[calc(100%-400px)] overflow-scroll h-full flex sm:block justify-between z-10 p-[40px]">
					{
							!loading && user ?
							<div className=''>
								<ProfileActions contact={user}/>
								<ProfileInfos	contact={user}/>
								<ProfileHistory	contact={user}/>
								<ProfileStats	contact={user}/>
							</div>
							:
							<div className='flex items-center justify-center w-full h-full'>
								<Loading/>
							</div>
					}
				</div>
				<SocialInterface/>
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