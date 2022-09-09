import { FiFlag } from 'react-icons/fi';


type GameBarProps = {
	userLeftName : string,
	userRightName : string,

	userLeftPhoto : string,
	userRightPhoto : string,
	
	resignFunc : () => {},
	userLeftProfileFunc : () => {},
	userRightProfileFunc : () => {},
}

function GameBar({userLeftName, userRightName, userLeftPhoto, userRightPhoto, userLeftProfileFunc, userRightProfileFunc, resignFunc}: GameBarProps) {
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
							onClick={userLeftProfileFunc}>
				<div className="	w-[32px] h-[32px]
								bg-slate-500 rounded-full overflow-hidden">
					<img src={userLeftPhoto} className="rounded-full " width="32" height="32" alt="userimage"></img>
				</div>
				<p>{userLeftName}</p>
			</div>
			<div className='flex gap-[4px] text-[16px] items-center justify-center
								font-space text-slate-500 hover:text-slate-300
								transition-all duration-300 ease-in-out
								cursor-pointer'
				onClick={resignFunc}>
				<FiFlag></FiFlag>
				Resign
			</div>
			<div className='w-[200px]
							flex gap-[8px] items-center flex-row-reverse
							font-space text-slate-500 hover:text-slate-300
							transition-all duration-300 ease-in-out
							cursor-pointer'
							onClick={userRightProfileFunc}>

				<div className=" w-[32px] h-[32px]
								bg-slate-500 rounded-full overflow-hidden">
					<img src={userRightPhoto} className="rounded-full" width="32" height="32" alt="userimage"></img>
				</div>
				<p>{userRightName}</p>
			</div>
			

		</div>
	)
}

GameBar.defaultProps = {
	userLeftName : 'userontheleft',
	userRightName : 'userontheright',
	userLeftPhoto : 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Osama_bin_Laden_portrait.jpg/260px-Osama_bin_Laden_portrait.jpg',
	userRightPhoto : 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Joseph_Stalin_at_the_Tehran_conference_on_1943.jpg/220px-Joseph_Stalin_at_the_Tehran_conference_on_1943.jpg',
	resignFunc : () => {},
	userLeftProfileFunc : () => {},
	userRightProfileFunc : () => {},
}

export default GameBar;