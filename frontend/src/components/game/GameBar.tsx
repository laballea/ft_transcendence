import { FiFlag } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { status } from '../../common/types';
import { quitGameSocket } from '../../context/socket';


type GameBarProps = {
	game:any
}

function GameBar({game}: GameBarProps) {
	let navigate = useNavigate();
	const global = useSelector((state: any) => state.global)
	return (  
		<div 
			className="	w-full h-[48px] bottom-0 p-[16px] pr-2 pl-2 
						flex items-center justify-between
						z-20
						opacity-50">
							
			<div className='w-[200px]
							flex gap-[8px] items-center 
							font-space text-slate-500 hover:text-slate-300
							transition-all duration-300 ease-in-out
							cursor-pointer
							'
							onClick={()=>{navigate('/app/profile/' + game.users[0].username, { state: {id:game.users[0].id} })}}>
				{/* <div className="	w-[32px] h-[32px]
								bg-slate-500 rounded-full overflow-hidden">
					<img src={game.users[0].profilPic} className="rounded-full " width="32" height="32" alt="userimage"></img>
				</div> */}
				<p>{game.users[0].username}</p>
			</div>
			<div className='flex gap-[4px] text-[16px] items-center justify-center
								font-space text-slate-500 hover:text-slate-300
								transition-all duration-300 ease-in-out
								cursor-pointer'
				onClick={() => quitGameSocket(global)}>
				<FiFlag></FiFlag>
				{global.status === status.Spectate ? "Leave" : "Resign"}
			</div>
			<div className='w-[200px]
							flex gap-[8px] items-center flex-row-reverse
							font-space text-slate-500 hover:text-slate-300
							transition-all duration-300 ease-in-out
							cursor-pointer'
							onClick={()=>{navigate('/app/profile/' + game.users[1].username, { state: {id:game.users[1].id} })}}>

				{/* <div className=" w-[32px] h-[32px]
								bg-slate-500 rounded-full overflow-hidden">
					<img src={game.users[1].profilPic} className="rounded-full" width="32" height="32" alt="userimage"></img>
				</div> */}
				<p>{game.users[1].username}</p>
			</div>
			

		</div>
	)
}

GameBar.defaultProps = {
	game:{}
}

export default GameBar;