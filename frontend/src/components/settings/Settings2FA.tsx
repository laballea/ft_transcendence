import React, {useEffect} from 'react'
import {useState} from 'react'
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

// Assets
import {FiShield, FiShieldOff} from 'react-icons/fi'

type Settings2FAProps = {

}

// eslint-disable-next-line
const Settings2FA = ({} : Settings2FAProps) => {
	const global = useSelector((state: any) => state.global)
	const [searchParams, setSearchParams] = useSearchParams();
	const jwt = searchParams.get("jwt") == null ? null : searchParams.get("jwt");
	const [image, setInput] = useState({
		src: "",
		code: ""
	})
	const [twoFA,setTwoFA] = useState(global.twoFactor)

	useEffect(() => {
		generate()
	}, []);

	const generate = () => {
		const requestOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
				'Access-Control-Allow-Origin': '*',
				'Authorization': 'bearer ' + global.token,
			},
		}
		fetch("http://localhost:5000/2fa/generate", requestOptions)
		.then(response =>
			response.blob()
		)
		.then(data => {
			const imageObjectURL = URL.createObjectURL(data);
			image.src = imageObjectURL
			setInput(image)
		})
	}

	const handleTwoFA = (twoFA : boolean) => {
		if (twoFA) {
			const requestOptions = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json;charset=utf-8',
					'Access-Control-Allow-Origin': '*',
					'Authorization': 'bearer ' + global.token,
				},
			}
			fetch("http://localhost:5000/2fa/turn-off", requestOptions).then(resp => {
				if (resp.ok)
					setTwoFA(false)
					generate()
			})
		} else {
			generate()
		}
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
		setInput({
			...image,
			[e.target.name]: e.target.value
		})
	}

	const sendCode = (): void => {
		const requestOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
				'Access-Control-Allow-Origin': '*',
				'Authorization': 'bearer ' + global.token,
			},
			body: JSON.stringify({
				code: image.code,
			})
		}
		fetch("http://localhost:5000/2fa/turn-on", requestOptions).then(resp => {
			if (resp.ok)
				setTwoFA(true)
		})

		setInput({
			src: image.src,
			code: ""
		})
	}

	if (twoFA === true) {
		return (
			<>
				<div  className='w-full border h-[2px] border-slate-700'></div>
				<h2 className='font-pilowlava text-[64px] text-transparent backgroundTextOutline'>2FA</h2>	
				<div onClick={ () => { handleTwoFA(twoFA) }} className='relative inline-block h-[64px] w-[195px] bg-slate-700 rounded-full'>
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
			<div  className='w-full border h-[2px] border-slate-700'></div>
			<h2 className='font-pilowlava text-[64px] text-transparent backgroundTextOutline'>2FA</h2>	
			<div onClick={ () => { handleTwoFA(twoFA); }} className='relative inline-block h-[64px] w-[195px] bg-slate-700 rounded-full'>
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
			<div>
				{image.src ? <img src={image.src} style={{height:'250px', width:'250px'}} alt="" /> : null}
			</div>
			<div>
				<input
					type="text"
					placeholder="write here..."
					value={image.code}
					onChange={handleChange}
					name="code"
					
				/>
				<button
					className="add-chat"
					onClick={sendCode}
					style={{color:'white', marginLeft: '25px'}}
				>
					Send
				</button>
			</div>
		</>
	)
}

Settings2FA.defaultProps = {
}

export default Settings2FA