import React from "react";
import { Canvas } from '@react-three/fiber'

import Text from "./3d/Text";

// CSS
import '../../../assets/fonts/fonts.css';


const BackgroundLobby = () => {
	return (
		<div className="w-full h-full
						flex items-center justify-center
						bg-gradient-to-r
						from-purple-500/50
						via-slate-700/50
						to-purple-700/50 
						bg-[length:400%]
						animate-bgpanright">
			<p className='font-pilowlava text-[64px] text-transparent backgroundTextOutline 
							animate-deglingo'>
				TRANS
			</p>
		</div>
		// THREE JS Stuff too laggy for schoole
		/* 
		<div className="w-full h-full flex items-center justify-center">
			<Canvas>
				<ambientLight/>
				<pointLight position={[10, 10, 10]} />
				<Text position={[0, 0 ,0]}/>
			</Canvas>
		</div> */
	);
}

export default BackgroundLobby;