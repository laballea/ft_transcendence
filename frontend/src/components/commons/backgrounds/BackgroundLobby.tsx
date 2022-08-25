import React from "react";
import { Canvas } from '@react-three/fiber'

import Text from "./3d/Text";

// CSS
import '../../../assets/fonts/fonts.css';


const BackgroundLobby = () => {
	return (  
		<div className="w-full h-full flex items-center justify-center">
			<Canvas>
				<ambientLight/>
				<pointLight position={[10, 10, 10]} />
				<Text position={[0, 0 ,0]}/>
			</Canvas>
		</div>
	);
}

export default BackgroundLobby;