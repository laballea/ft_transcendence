import React, { useState } from 'react'

// Components
import NavBar from '../../navbar/NavBar'
import ContactList from '../../contactList/ContactList';
import Message from '../../message/FloatingMessage';
import Footer from '../../commons/footer/Footer';
import BackgroundLobby from '../../commons/backgrounds/BackgroundLobby';

// CSS
import '../../../assets/fonts/fonts.css';

//Redux
import { useSelector } from 'react-redux';
import ChatBar from '../../message/chatBar';
import ChatRooms from '../../room/ChatRooms';
import RoomBar from '../../room/roomBar';
import Room from "../../room/index";
import Game from '../../game/Game';
import { status } from '../../../common/types';

import { socket } from '../../../context/socket';
import { useSearchParams } from 'react-router-dom';

export default function Home() {
	const global = useSelector((state: any) => state.global)
	document.title = "FT_TRANS "+ global.username;
	const [searchParams, setSearchParams] = useSearchParams();
	const jwt = searchParams.get("jwt") == null ? null : searchParams.get("jwt"); // get jwt token on query

	const [image, setInput] = useState({
		src: "",
		code: ""
	})

	const set2fa = () => {
		const requestOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
				'Access-Control-Allow-Origin': '*',
				'Authorization': 'bearer ' + global.token,
			},
		}
		fetch("http://localhost:5000/2fa/generate", requestOptions)
		.then(response =>
			response.blob()
		)
		.then(data => {
			const imageObjectURL = URL.createObjectURL(data);
			console.log(imageObjectURL)
			image.src = imageObjectURL
		})
	}

	const unset2fa = () => {
		const requestOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
				'Access-Control-Allow-Origin': '*',
				'Authorization': 'bearer ' + global.token,
			},
		}
		fetch("http://localhost:5000/2fa/turn-off", requestOptions)
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
		setInput({
			...image,
			[e.target.name]: e.target.value
		})
	}

	const sendCode = (): void => {
		console.log("Send code")
		const requestOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
				'Access-Control-Allow-Origin': '*',
				'Authorization': 'bearer ' + global.token,
			},
			body: JSON.stringify({
				code: image.code,
			})
		}
		fetch("http://localhost:5000/2fa/turn-on", requestOptions)

		setInput({
			src: image.src,
			code: ""
		})
	}
	return (
		<div className="w-full h-screen relative bg-slate-900">
			{
				global.convID !== undefined && 
					<div className='absolute left-[12px] bottom-[40px] z-50'>
						<Message/>
					</div>

			}
			<NavBar/>
			<div className="absolute flex justify-between
							w-full top-[80px] sm:top-[112px] bottom-0 sm:bottom-[48px]">
				<div className="hidden w-[calc(100%-400px)] h-full flex sm:block justify-between bg-slate-700 z-50">
					<div className="relative h-[calc(100%-30px)] w-full flex justify-between bg-slate-700 ">
						{global.convID != undefined && <Message/>}
						{(global.status === status.InGame || global.status === status.InQueue) && <Game/>}
						<ChatRooms/>
						<div>
							<button
								className="add-chat"
								onClick={set2fa}
								style={{color:'white'}}
							>
								Turn On 2fa
							</button>
							<button
								className="add-chat"
								onClick={unset2fa}
								style={{color:'white'}}
							>
								Turn Off 2fa
							</button>
							{image.src ? <img src={image.src} style={{height:'250px', width:'250px'}} alt="" /> : null}
						</div>
						<div>
							<input
								type="text"
								placeholder="write here..."
								value={image.code}
								onChange={handleChange}
								name="code"
								
							/>
							<button
								className="add-chat"
								onClick={sendCode}
								style={{color:'white', marginLeft: '25px'}}
							>
								Send
							</button>
						</div>
						<RoomBar/>
						{global.roomID != undefined && <Room/>}

				<div className="w-[calc(100%-400px)] h-full flex sm:block justify-between z-10">
					<div className="relative w-full h-full flex justify-between ">
						{
							(global.status === status.InGame 
								|| global.status === status.InQueue 
								|| global.status === status.Spectate)
							?
							 <Game/>
							:
							<div className='w-full h-full overflow-hidden'>
								<BackgroundLobby/>
							</div>
						}
					</div>
				</div>
				<div className="relative flex-initial flex w-full bg-slate-800 sm:w-[400px] flex-col h-full">
					<ContactList/>
				</div>
			</div>
			<Footer/>
		</div>
	)
}