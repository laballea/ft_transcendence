import React from 'react'

type NavBarButtonHomeProps = {
	onClick : () => void
}

const NavBarButtonHome = ({onClick} : NavBarButtonHomeProps) => {
	return (
		<>
			<button	
				className="	bg-transparent h-[48px] sm:h-[64px] mr-[48px]
							font-space text-[20px] text-slate-400 hover:text-slate-200
							transition-all duration-300 ease-in-out
							flex justify-center items-center" 
				onClick={onClick} >
					<p className="font-pilowlava text-[20px] text-slate-transparent hover:text-slate-200
							transition-all duration-300 ease-in-out
							flex justify-center items-center">
						Trans
					</p>
			</button>
		</>
	)
}

NavBarButtonHome.defaultProps = {
	onClick: () => { console.log("Default Click : no actions assigned")},
}

export default NavBarButtonHome
