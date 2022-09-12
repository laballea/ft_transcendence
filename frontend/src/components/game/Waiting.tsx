import React, { useContext } from 'react'
import { SocketContext } from '../../context/socket';
import { FiZapOff } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux'
import { setGameStatus } from '../../store/global/reducer';
import DefaultButtonPrimary from '../commons/buttons/DefaultButtonPrimary';
import { status } from '../../common/types';
import Loading from '../commons/utils/Loading';

const Waiting = () => {
	const global = useSelector((state: any) => state.global)
	const dispatch = useDispatch()
	const socket = useContext(SocketContext);
	return(
		<div 
			className='flex h-full w-full items-center justify-center flex-col
						animate-rollin'
		>
			<div className='absolute z-0 opacity-25'>
				<Loading></Loading>
			</div>
			<p className='font-space text-slate-400 mb-[8px] text-[12px]'>
				Searching for a <i className='inline text-slate-500'>{global.gamemode}</i> game !
			</p>
			<div className='z-10'>
				<DefaultButtonPrimary cta="Cancel" disable={false} icon={FiZapOff}
						onClick={()=>{
							socket.emit("QUIT_QUEUE", {
								client_send: global.username,
								gamemode:global.gamemode,
								jwt:global.token
							})
							dispatch(setGameStatus(status.Connected))
						}}
				
				/>
			</div>

		</div>
	)
}

export default Waiting