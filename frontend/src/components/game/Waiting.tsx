import React, { useContext } from 'react'
import { SocketContext } from '../../context/socket';
import { FiZapOff } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux'
import { setGameStatus } from '../../store/global/reducer';
import DefaultButtonPrimary from '../commons/buttons/DefaultButtonPrimary';
import { status } from '../../common/types';

const Waiting = () => {
	const global = useSelector((state: any) => state.global)
	const dispatch = useDispatch()
	const socket = useContext(SocketContext);
	return(
		<div style={{display:'flex', flex:1, height:'100%', justifyContent:'center', alignItems:'center', flexDirection:"column"}}>
			<p>Searching for {global.gamemode} game !</p>
			<DefaultButtonPrimary cta="Quit" disable={false} icon={FiZapOff}
					onClick={()=>{
						socket.emit("QUIT_QUEUE", {
							client_send: global.username,
							gamemode:global.gamemode,
							jwt:global.token
						})
						dispatch(setGameStatus(status.Connected))
					}}/>
		</div>
	)
}

export default Waiting