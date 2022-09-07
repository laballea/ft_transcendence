import React from 'react'
import { FiAlertOctagon, FiSmile } from 'react-icons/fi'

type PopUpWindowProps = {
	content : string,
	error:boolean
}

const PopUpWindow = ({ content, error } : PopUpWindowProps) => {

	return (
		<>
				<div className={	error === true ? 
									"bg-red-500/50 text-red-500 p-[16px]	 absolute flex items-center gap-[16px] bottom-[24px] left-[24px] font-space text-[16px] whitespace-nowrap transition-all duration-500 ease-in-out " 
									: 
									"bg-green-500/50 text-green-500 p-[16px] absolute flex items-center gap-[16px] bottom-[24px] left-[24px] font-space text-[16px] whitespace-nowrap transition-all duration-500 ease-in-out "
								}
				>		
							{ error === true ? 
							<FiAlertOctagon className='text-[24px]'/>
							:
							<FiSmile className='text-[24px]'/>
						}

						<p>
							{content}
						</p>
				</div>
		</>
	) 
}

PopUpWindow.defaultProps = {
	content: "",
	error:true
}

export default PopUpWindow
