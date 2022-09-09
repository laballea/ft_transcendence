import React, {useEffect, useState} from 'react';
import Chat from './chat'
import Com from './com'
import { useDispatch, useSelector } from 'react-redux'
import IconButton from '../commons/buttons/IconButton';
import { FiChevronsDown, FiChevronsUp, FiEdit, FiLogOut, FiSettings, FiSlash, FiTrash2, FiVolume2, FiVolumeX, FiX } from 'react-icons/fi';
import { setCurrentConv } from '../../store/global/reducer';
import './noScrollBar.css'
import { truncateString } from '../commons/utils/truncateString';
import { deleteMember, changePass, upgradeMember, downgradeMember, banMember, muteMember, unmutedMember } from '../../context/socket';
import NavBarButtonSecondary from '../commons/buttons/NavBarButtonSecondary';

export interface MessageI {
		author: string
		content: string
		date: string
}

function FloatingMessage() {
	const global = useSelector((state: any) => state.global)
	const dispatch = useDispatch();
	const [settings, setSettings] = useState(false)
	const [newPass, setNewPass] = useState(false)
	const [input, setInput] = useState({
		oldPass: "",
		newPass: ""
	})

	const conv = global.currentConv === -1 ?
		{
			id:-1,
			msg:[],
			name:global.clientChat,
			users:[{username:global.clientChat}]
		}
		:
		global.currentConv

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
		setInput({
			...input,
			[e.target.name]: e.target.value
		})
	}

	useEffect(() => {
		var element = document.getElementById("someRandomID");
		if (element !== null)
			element.scrollTop = element.scrollHeight;
	}, [global.currentConv]);
	const users = conv.ownerId !== undefined ?
		conv.users.map((user: {id:number, username:string}, index:number) =>
			<div className={`bg-slate-700 flex flex-row justify-center items-end m-[2px] w-full text-center rounded text-slate-400`} key={index}>
				<h3>{ truncateString(user.username, 9) }</h3>
				{conv.adminId.find((e:number) => e === global.id) !== undefined && conv.adminId.find((e:number) => e === user.id) === undefined &&
					<div className='flex flex-row'>
						<IconButton icon={FiX} onClick={()=>{deleteMember(global, conv.id, user.id)}}></IconButton>
						<IconButton icon={FiSlash} onClick={()=>{banMember(global, conv.id, user.id)}}></IconButton>
						{conv.muted.find((e:any) => e.userId === user.id) !== undefined ?
							<IconButton icon={FiVolumeX} onClick={()=>{unmutedMember(global, conv.id, user.id)}}></IconButton>
							:
							<IconButton icon={FiVolume2} onClick={()=>{
								muteMember(global, conv.id, user.id)
							}}></IconButton>
						}
					</div>
				}
				{conv.ownerId === global.id && conv.ownerId !== user.id && conv.adminId.find((e:number) => e === user.id) === undefined &&
					<IconButton icon={FiChevronsUp} onClick={()=>{upgradeMember(global, conv.id, user.id)}}></IconButton>
				}
				{conv.ownerId === global.id && conv.ownerId !== user.id && conv.adminId.find((e:number) => e === user.id) !== undefined &&
					<IconButton icon={FiChevronsDown} onClick={()=>{downgradeMember(global, conv.id, user.id)}}></IconButton>
				}
			</div>
		)
		: [];

	return (
		<div className='w-full h-full
						flex justify-center flex-col
						rounded-md
						drop-shadow-custom1
						'>
			<div className='w-full h-auto p-[16px] flex items-center  justify-between bg-slate-700 drop-shadow-custom2 '>
				<h3 className='font-space text-slate-200 text-[16px]'>
					{conv.adminId !== undefined ? conv.name : conv.users.find((user:any) => user.username !== global.username).username}
				</h3>
				{ conv.adminId !== undefined && 
					<p className='absolute top-[6px]
									font-space text-[10px] italic text-slate-900'>
						Group
					</p>
				}
				<div className='text-[12px] h-[24px]'>
					{conv.adminId !== undefined &&
						<IconButton icon={FiSettings} onClick={()=>{setSettings(!settings)}}></IconButton>
					}
					<IconButton icon={FiX} onClick={()=>{dispatch(setCurrentConv({conv:undefined}))}}></IconButton>
				</div>
			</div>
			{settings ?
				<div className='flex flex-col flex-grow items-center'>
					<div id="someRandomID" className='overflow-y-scroll flex-grow'>
						{newPass ?
							<div  className='flex flex-grow flex-col items-center'>
							<input
								className="flex h-[50px]
											p-[8px] pl-[12px] rounded-sm
											bg-slate-800 text-slate-200 placeholder:text-slate-400
											font-space text-[16px]
											m-5"
								type="password"
								placeholder="Old password"
								value={input.oldPass}
								onChange={handleChange}
								name="oldPass"
							/>
							<input
								className="	flex h-[50px]
											p-[8px] pl-[12px] rounded-sm
											bg-slate-800 text-slate-200 placeholder:text-slate-400
											font-space text-[16px]
											m-5
											"
								type="password"
								placeholder="New password"
								value={input.newPass}
								onChange={handleChange}
								name="newPass"
							/>
							<button	
								className="bg-transparent border-2 h-[32px] sm:h-[48px] w-[160px] sm:w-[164px] rounded
											font-space text-[16px] text-slate-400
											transition-all duration-300 ease-in-out
											flex justify-center items-center border-green-400 hover:border-green-200 hover:text-green-200 text-green-400"
								onClick={() => {changePass(global, conv.id, global.id, input.oldPass, input.newPass)
									setNewPass(!newPass)
								}}
							>
								<p>Confirm</p>
							</button>
						</div>
							: users
						}
					</div>
					<div className='flex flex-row'>
						{ conv.adminId.find((e:number) => e === global.id) !== undefined ?
							<div>
								<NavBarButtonSecondary cta="Change Password" icon={FiEdit} onClick={()=>{setNewPass(!newPass)}}/>
							</div>
							:
							[]
						}
						{ conv.ownerId === global.id ?
							<NavBarButtonSecondary cta="Delete Room" icon={FiTrash2} onClick={()=>{deleteMember(global, conv.id, global.id)}}/>
							:
							<NavBarButtonSecondary cta="Quit Room" icon={FiLogOut} onClick={()=>{deleteMember(global, conv.id, global.id)}}/>
						}
					</div>
				</div>
				:
				<div id="someRandomID" className='overflow-y-scroll flex-grow'>
					<Chat msg={conv.msg} username={global.username}/>
				</div>
			}
			<div className='w-full h-auto p-[4px] 
							flex items-center bg-slate-700
							drop-shadow-custom1'>
				<Com conv={conv} />
			</div>
		</div>
	)
}

export default FloatingMessage;