import React from "react";

// CSS
import '../../../assets/fonts/fonts.css';

const Loading = () => {
	return ( 
		<div className=" w-[120px] h-[120px] 
						flex  items-center justify-center
						font-pilowlava text-transparent backgroundTextOutline text-[120px]
						animate-spin
						">
			<p>0</p>
		</div>
	);
}



export default Loading;