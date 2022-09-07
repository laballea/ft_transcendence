import React, {useEffect} from 'react'
import {useState} from 'react'
import { FiCheck, FiX } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import IconButton from '../buttons/IconButton';

function PopUp2FAModal() {
	const global = useSelector((state: any) => state.global)
	const [twoFA,setTwoFA] = useState(global.twoFactor)

	const [image, setInput] = useState({
		src: "",
		code: ""
	})

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

	return ( 
		<div className="fixed left-0 top-0 w-full h-full bg-slate-900/50 z-50 
						flex items-center justify-center">
			<div className="
							relative
							w-[600px] p-[40px]
							bg-slate-800
							shadow-xl
							">
				<div className='absolute top-[8px] right-[8px]'>
					<IconButton icon={FiX}/>
				</div>
				<h3 className='font-pilowlava text-[64px] text-transparent backgroundTextOutline'>
					Enable 2FA
				</h3>
				<p className='font-space text-[14px] text-slate-300'>
					Please flash the QR code below with Google Authentificator.
				</p>
				<div className='mt-[16px] mb-[16px]'>
					{
						image.src ? 
						<img src={image.src} style={{height:'250px', width:'250px'}} alt="" /> 
						: 
						null
					}
				</div>
				<div>
					<input
						type="text"
						placeholder="Enter code here..."
						value={image.code}
						onChange={handleChange}
						name="code"
						className='	bg-transparent p-[8px] pl-[16px]
									border-b-[1px] border-slate-400 hover:border-slate-200 focus:border-transparent
									font-space text-[16px] text-slate-200 placerholder:hover:text-slate-200 placeholder:text-slate-400
									transition-all duration-300 ease-in-out'
					/>
					<button
						className="add-chat"
						onClick={sendCode}
						style={{color:'white', marginLeft: '25px'}}
					>
						<div>
							<FiCheck></FiCheck>
						</div>
					</button>
				</div>
			</div>
		</div>
	 );
}

export default PopUp2FAModal;