
import React from 'react'
import { useSelector } from 'react-redux'

const Waiting = () => {
	const global = useSelector((state: any) => state.global)

	return(
		<div style={{display:'flex', flex:1, height:'100%', justifyContent:'center', alignItems:'center'}}>
			<p>Searching for players</p>
		</div>
	)
}

export default Waiting