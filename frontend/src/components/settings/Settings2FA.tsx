import React, {useEffect} from 'react'
import {useState} from 'react'
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

// Assets
import {FiShield, FiShieldOff} from 'react-icons/fi'
import PopUp2FAModal from '../commons/popup/PopUp2FAModal';

type Settings2FAProps = {

}

// eslint-disable-next-line
const Settings2FA = ({} : Settings2FAProps) => {
	const global = useSelector((state: any) => state.global)

	const handleTwoFA = () => {
		if (global.twoFactor) {
			const requestOptions = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json;charset=utf-8',
					'Access-Control-Allow-Origin': '*',
					'Authorization': 'bearer ' + global.token,
				},
			}
			fetch("http://localhost:5000/2fa/turn-off", requestOptions).then(resp => {
				

			})
		} 
	}

	console.log("global 2fa" + global.twoFactor)
	if (global.twoFactor === true) {
		return (
			<>
				<div  className='w-full border h-[2px] border-slate-700'></div>
				<h2 className='font-pilowlava text-[64px] text-transparent backgroundTextOutline'>2FA</h2>	
				<div onClick={ () => { handleTwoFA() }} className='relative inline-block h-[64px] w-[195px] bg-slate-700 rounded-full'>
					<span className='absolute top-0 left-[20px] h-full flex items-center justify-start z-10 gap-[4px]
										text-red-500 cursor-pointer' >
						<FiShieldOff className="w-[24px] h-[24px] cursor-pointer "/>
						<p className='font-space font-[12px] hidden cursor-pointer'> Disabled</p>
					</span>
					<span className='absolute top-0 right-[20px] h-[64px] flex items-center justify-end z-10 gap-[4px]
										text-green-500 cursor-pointer' >
						<FiShield className="w-[24px] h-[24px] cursor-pointer"/>
						<p className='font-space font-[12px] cursor-pointer'> Enabled</p>
					</span>
					<span className='absolute h-[48px] w-[124px] bg-green-200 right-[8px] top-[8px] transition-all duration-300 ease-in-out rounded-full z-0'></span>
					<span className='absolute cursor-pointer top-0 left-0 right-0 bottom-0  transition-all duration-300 ease-in-out rounded-full z-0'></span>
				</div>
			</>
		)
	}
	return (
		<>
			{
				<PopUp2FAModal></PopUp2FAModal>
			}
			<div  className='w-full border h-[2px] border-slate-700'></div>
			<h2 className='font-pilowlava text-[64px] text-transparent backgroundTextOutline'>2FA</h2>	
			<div onClick={ () => { handleTwoFA(); }} className='relative inline-block h-[64px] w-[195px] bg-slate-700 rounded-full'>
				<span className='absolute top-0 left-[20px] h-full flex items-center justify-start z-10 gap-[4px]
									text-red-500 cursor-pointer' >
					<FiShieldOff className="w-[24px] h-[24px] cursor-pointer "/>
					<p className='font-space font-[12px] cursor-pointer'> Disabled</p>
				</span>
				<span className='absolute top-0 right-[20px] h-[64px] flex items-center justify-end z-10 gap-[4px]
									text-green-500 cursor-pointer' >
					<FiShield className="w-[24px] h-[24px] cursor-pointer"/>
					<p className='font-space font-[12px] hidden cursor-pointer'> Enabled</p>
				</span>
				<span className='absolute h-[48px] w-[132px] bg-red-300 left-[8px] top-[8px] transition-all duration-300 ease-in-out rounded-full z-0'></span>
				<span className='absolute cursor-pointer top-0 left-0 right-0 bottom-0  transition-all duration-300 ease-in-out rounded-full z-0'></span>
			</div>
		</>
	)
}

Settings2FA.defaultProps = {
}

export default Settings2FA