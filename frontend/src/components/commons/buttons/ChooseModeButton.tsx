import React from 'react'

type ChooseModeButtonProps = {
	cta : string,
	onClick : () => void,
	check:boolean,
	disable: boolean
}

const ChooseModeButton = ({cta, onClick, disable, check } : ChooseModeButtonProps) => {
	return (
		<button	
				className= {`bg-transparent ${!check ? "text-slate-400 hover:text-slate-200" : "text-green-400 hover:text-green-200"}
							font-space text-[10px]
							transition-all duration-300 ease-in-out
							flex justify-center items-center `}
				disabled={disable}
				onClick={onClick}>
				<p>{ cta }</p>
		</button>
	)
}

ChooseModeButton.defaultProps = {
	cta: "Default",
	onClick: () => { console.log("Default Click : no actions assigned")},
	check:false,
	disable: false

}

export default ChooseModeButton
