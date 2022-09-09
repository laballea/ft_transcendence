import React, { useState} from 'react';
import { useDispatch, useSelector } from 'react-redux'
import IconButton from '../commons/buttons/IconButton';
import { FiX } from 'react-icons/fi';
import { setCreateRoom } from '../../store/global/reducer';
import './noScrollBar.css'
import { joinRoomSocket, newChatRoom } from '../../context/socket';
import ChatBar from './chatBar';

function CreateRoom() {
	const global = useSelector((state: any) => state.global)
	const dispatch = useDispatch();
	const [mode, setMode] = useState(0)
	const [input, setInput] = useState({
		roomName: "",
		password: "",
		confirmed: "",
	})
	const [errorPass, setErrorPass] = useState(false)
	const [errorName, setErrorName] = useState(false)
	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
		setInput({
			...input,
			[e.target.name]: e.target.value
		})
	}

	const pushRoom = ():void => {
		if (input.password !== input.confirmed)
			setErrorPass(true)
			//alert("password does not match !")
		else if (input.roomName.length === 0)
			setErrorName(true)
			//alert("room has no name")
		else {
			newChatRoom(global, input.roomName, input.password)
			dispatch(setCreateRoom({}))
		}
		setInput({
			roomName: "",
			password: "",
			confirmed: "",
		})
	}

	const joinRoom = ():void => {
		joinRoomSocket(global, input.roomName, input.password)
		setInput({
			roomName: "",
			password: "",
			confirmed: "",
		})
	}

	if (!errorName && input.roomName.length === 0)
		setErrorName(true)
	else if (errorName && input.roomName.length !== 0) setErrorName(false)

	if (!errorPass && input.password !== input.confirmed)
		setErrorPass(true)
	else if (errorPass && input.password === input.confirmed) setErrorPass(false)

	return (
		<div className='w-[400px] h-[460px] 
						flex justify-center flex-col
						rounded-md
						drop-shadow-custom1
						bg-slate-700'>
			<div className='w-full h-auto p-[8px] flex items-center justify-between bg-slate-700 drop-shadow-custom2'>
				<h3 className={`font-space cursor-pointer ${mode === 1 ? "text-green-200" : "text-slate-200"}`} onClick={()=>{setMode(mode === 1 ? 0 : 1)}}>
					create room
				</h3>
				<h3 className={`font-space cursor-pointer ${mode === 2 ? "text-green-200" : "text-slate-200"}`} onClick={()=>{setMode(mode === 2 ? 0 : 2)}}>
					join room
				</h3>
				<IconButton icon={FiX} onClick={()=>{dispatch(setCreateRoom({}))}}></IconButton>
			</div>
			{mode === 0 && 
				<ChatBar/>
			}
			{mode === 1 &&
				<div  className='flex flex-grow flex-col items-center'>
					<input
						className={`flex h-[50px]
									p-[8px] pl-[12px] rounded-sm
									bg-slate-800 text-slate-200 placeholder:text-slate-400
									font-space text-[16px]
									m-5 ${errorName && "border-2 border-red-400"}
									`}
						type="text"
						placeholder="room name"
						value={input.roomName}
						onChange={handleChange}
						name="roomName"
					/>
					<input
						className="	flex h-[50px]
									p-[8px] pl-[12px] rounded-sm
									bg-slate-800 text-slate-200 placeholder:text-slate-400
									font-space text-[16px]
									m-5
									"
						type="password"
						placeholder="password"
						value={input.password}
						onChange={handleChange}
						name="password"
					/>
					<input
						className={`flex h-[50px]
									p-[8px] pl-[12px] rounded-sm
									bg-slate-800 text-slate-200 placeholder:text-slate-400
									font-space text-[16px]
									m-5 ${errorPass && "border-2 border-red-400"}
									`}
						type="password"
						placeholder="confirm password"
						value={input.confirmed}
						onChange={handleChange}
						name="confirmed"
					/>
					<button	
						className={`bg-transparent border-2 h-[32px] sm:h-[48px] w-[160px] sm:w-[164px] rounded
									font-space text-[16px] text-slate-400
									transition-all duration-300 ease-in-out
									flex justify-center items-center ${errorName || errorPass ? "border-red-400" : "border-green-400 hover:border-green-200 hover:text-green-200 text-green-400"}`}
						onClick={pushRoom}
						disabled={errorName || errorPass}
						>
						<p>Create</p>
					</button>
				</div>
				}
				{mode === 2 &&
				<div  className='flex flex-grow flex-col items-center'>
					<input
						className={`flex h-[50px]
									p-[8px] pl-[12px] rounded-sm
									bg-slate-800 text-slate-200 placeholder:text-slate-400
									font-space text-[16px]
									m-5 ${errorName && "border-2 border-red-400"}
									`}
						type="text"
						placeholder="room name"
						value={input.roomName}
						onChange={handleChange}
						name="roomName"
					/>
					<input
						className="	flex h-[50px]
									p-[8px] pl-[12px] rounded-sm
									bg-slate-800 text-slate-200 placeholder:text-slate-400
									font-space text-[16px]
									m-5
									"
						type="password"
						placeholder="password"
						value={input.password}
						onChange={handleChange}
						name="password"
					/>
					<button	
						className={`bg-transparent border-2 h-[32px] sm:h-[48px] w-[160px] sm:w-[164px] rounded
									font-space text-[16px] text-slate-400
									transition-all duration-300 ease-in-out
									flex justify-center items-center ${errorName ? "border-red-400" : "border-green-400 hover:border-green-200 hover:text-green-200 text-green-400"}`}
						onClick={joinRoom}
						disabled={errorName}
						>
						<p>Join</p>
					</button>
				</div>
			}
			
		</div>
	)
}

export default CreateRoom;