import React from 'react'

type PopUpWindowProps = {
	content : string,
	error:boolean
}

const PopUpWindow = ({ content, error } : PopUpWindowProps) => {

	return (
		<div className=" absolute bottom-0 left-0 p-[12px] w-fit ">
				<p	
					className="rounded
								flex justify-left items-center
								w-[300px] p-[24px] h-[48px]
								bg-slate-700
								font-space text-[16px] text-slate-500 hover:text-slate-400
								transition-all duration-500 ease-in-out
								shadow-addFriend"
					style={{color:error ? "#902923" : "#2CDA9D"}}
				>
					{content}
				</p>
		</div>
	)
}

PopUpWindow.defaultProps = {
	content: "",
	error:true
}

export default PopUpWindow
