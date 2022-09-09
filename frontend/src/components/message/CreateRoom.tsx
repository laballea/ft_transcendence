import React, { useState} from 'react';
import { useDispatch, useSelector } from 'react-redux'
import IconButton from '../commons/buttons/IconButton';
import { FiArrowUpCircle, FiKey, FiPlusSquare, FiX } from 'react-icons/fi';
import { setCreateRoom } from '../../store/global/reducer';
import './noScrollBar.css'
import { joinRoomSocket, newChatRoom } from '../../context/socket';
import ChatBar from './chatBar';
import MiniIconButton from '../commons/buttons/MiniIconButton';

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

	const pushRoom = (e : any):void => {
		e.preventDefault()
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

	const joinRoom = (e : any):void => {
		e.preventDefault()
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
		<div className='w-full h-full 
						flex justify-center flex-col
						rounded-md
						drop-shadow-custom1
						'>
			<div className='w-full h-auto p-4 flex items-center justify-between
							drop-shadow-custom2'>
				<p className='font-pilowlava text-slate-600
								hover:text-slate-200 transition-all duration-300 ease-in-out
								cursor-pointer' 
								onClick={()=>{setMode(0)}}>Chats</p>
				<div className='h-[24px] flex gap-2'>
					<div className={`${mode === 1 ? 'text-purple-500':'text-slate-400'} 
									text-[24px]
									hover:text-slate-200 transition-all duration-300 ease-in-out
									cursor-pointer`}>
						<FiPlusSquare onClick={()=>{setMode(mode === 1 ? 0 : 1)}}/>
					</div>
					<div className={`${mode === 2 ? 'text-purple-500':'text-slate-400'} 
									text-[24px]
									hover:text-slate-200 transition-all duration-300 ease-in-out
									cursor-pointer`}>
						<FiKey onClick={()=>{setMode(mode === 2 ? 0 : 2)}}/>
					</div>
					
				</div>
			</div>
			<div className='h-[1px] bg-slate-800 mr-4 ml-4'></div>
			{mode === 0 && 
				<ChatBar/>
			}
			{mode === 1 &&
				<form
					onSubmit={pushRoom} 
					className='flex flex-grow w-full flex-col items-center justify-between p-4'>
					<div className='flex flex-col gap-2 w-full'>
						<input
							className="flex 
										h-12 w-full 
										p-[8px] pl-[12px] rounded-sm
										bg-slate-800 text-slate-200 placeholder:text-slate-400
										font-space text-[16px]
										"
							type="text"
							placeholder="room name"
							value={input.roomName}
							onChange={handleChange}
							name="roomName"
							maxLength={15}
							autoComplete="off"
							required
						/>
						<input
							className="	flex h-12 w-full
										p-[8px] pl-[12px] rounded-sm
										bg-slate-800 text-slate-200 placeholder:text-slate-400
										font-space text-[16px]
						
										"
							type="password"
							placeholder="password"
							value={input.password}
							onChange={handleChange}
							autoComplete="off"
							name="password"
						/>
						<input
							className={`flex h-12 w-full
										p-[8px] pl-[12px] rounded-sm
										bg-slate-800 text-slate-200 placeholder:text-slate-400
										font-space text-[16px]
										${errorPass && "border-2 border-red-400"}
										`}
							type="password"
							placeholder="confirm password"
							value={input.confirmed}
							onChange={handleChange}
							name="confirmed"
							autoComplete="off"
						/>
					</div>
					<button	
						type='submit'
						className={`bg-transparent border-2 h-[32px] sm:h-[48px] w-full rounded
									font-space text-[16px] text-slate-400
									transition-all duration-300 ease-in-out
									flex justify-center items-center ${errorPass ? "border-red-400" : "border-slate-400 hover:border-slate-200 hover:text-slate-200 text-slate-400"}`}
						
						>
						<p>Create</p>
					</button>
				</form>
				}
				{mode === 2 &&
				<form
				onSubmit={joinRoom} 
				className='flex flex-grow w-full flex-col items-center justify-between p-4'>
				<div className='flex flex-col gap-2 w-full'>
					<input
						className="flex 
									h-12 w-full 
									p-[8px] pl-[12px] rounded-sm
									bg-slate-800 text-slate-200 placeholder:text-slate-400
									font-space text-[16px]
									"
						type="text"
						placeholder="room name"
						value={input.roomName}
						onChange={handleChange}
						name="roomName"
						maxLength={15}
						autoComplete="off"
						required
					/>
					<input
						className="	flex h-12 w-full
									p-[8px] pl-[12px] rounded-sm
									bg-slate-800 text-slate-200 placeholder:text-slate-400
									font-space text-[16px]
					
									"
						type="password"
						placeholder="password"
						value={input.password}
						onChange={handleChange}
						autoComplete="off"
						name="password"
					/>
				</div>
				<button	
					type='submit'
					className="bg-transparent border-2 h-[32px] sm:h-[48px] w-full rounded
								font-space text-[16px] text-slate-400
								transition-all duration-300 ease-in-out
								flex justify-center items-center"
					
					>
					<p>Join</p>
				</button>
			</form>
			}
			
		</div>
	)
}

export default CreateRoom;