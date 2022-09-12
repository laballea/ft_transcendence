import React, { useState, useEffect, useRef } from 'react'
import { FiPlus } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { editProfilPicSocket } from '../../context/socket';

// Assets

const SettingsProfilPicChoice = () => {
	const global = useSelector((state: any) => state.global)
	const [profilPics, setProfilPics] = useState([]);
	const uploadRef = useRef<any>()


	const onFileChange = (event:any) => {
		fileUpload(event.target.files[0])
	};
	const fileUpload = (file:any) => {
		const formData = new FormData();
		formData.append( 
			"file", 
			file,
			file.filename
		);
		if (file.size >= 10000000){
			alert("File is too big!");
			return ;
		}
		fetch(`http://${process.env.REACT_APP_ip}:5000/users/upload`, {
			headers: {
				'Accept': 'application/json',
				'Authorization': 'bearer ' + global.token,
			},
			method: 'POST',
			body: formData
		}).then((response) =>  {
			retrievePics()
			return response.text();
		 })
	}
	const retrievePics = () => {
		const requestOptions = {
			method: 'GET',
			headers: {
			  'Content-Type': 'application/json;charset=utf-8',
			  'Access-Control-Allow-Origin': '*',
			  'Authorization': 'bearer ' + global.token,
			},
		}
		fetch(`http://${process.env.REACT_APP_ip}:5000/users/image`, requestOptions)
		.then(async response=>{
			let resp = await response.json();
			if (response.ok){
				setProfilPics(resp)
			}
		})
	}

	useEffect(() => {
		retrievePics()
		// eslint-disable-next-line
	}, []);

	const profilPicsComp = profilPics.length > 0 ? profilPics.map((url:string, index:number) =>
		<div className='w-[64px] h-[64px] rounded-full' key={index} onClick={()=> {editProfilPicSocket(global, url)}}>
			<img src={url} width="64" height="64" alt="profilpic" className='rounded-full'></img>
		</div>
	): [];
	return (
		<>
			<div className='flex items-center gap-2 h-[200px] overflow-scroll'>
				<div className='w-[64px] h-[64px] rounded-full
								bg-slate-700 hover:bg-slate-600
								flex items-center justify-center
								text-slate-500 hover:text-slate-400 text-[40px]
								transition-all duration-300 ease-in-out 
								cursor-pointer
								'
						onClick= {() => {
							let element: HTMLElement = document.getElementById('imageUploadButton') as HTMLElement;
							element.click();
						}}
								>
					<input 
							id="imageUploadButton"
							className='	absolute
										z-10
										h-[64px] w-[64px]
										invisible '
							type='file'
							 ref={uploadRef} 
							onChange={onFileChange} 
					>
					</input>
					<FiPlus/>
				</div> 
				{ profilPicsComp }
			</div>
		</>
	)
}

export default SettingsProfilPicChoice