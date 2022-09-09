import React, { useState, useEffect, useRef } from 'react'
import { FiDownload, FiPlus, FiX } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { editProfilPicSocket } from '../../context/socket';

// Assets

const SettingsProfilPicChoice = () => {
	const global = useSelector((state: any) => state.global)
	//const [file, setFile] = React.useState<any>(null);
	const [preview, setPreview] = React.useState<any>(null);
	const [profilPics, setProfilPics] = useState([]);
	const uploadRef = useRef<any>()
	const [isHovering, setIsHovering] = useState(false);

	const handleMouseOver = () => {
		setIsHovering(true);
	};
	
	const handleMouseOut = () => {
		setIsHovering(false);
	};

	const onFileChange = (event:any) => {
		fileUpload(event.target.files[0])
		/*setFile(event.target.files[0])
		let url = URL.createObjectURL(event.target.files[0])
		setPreview(url)*/
	};
	const fileUpload = (file:any) => {
		const formData = new FormData();
		formData.append( 
			"file", 
			file,
			file.filename
		); 
		fetch('http://localhost:5000/users/upload', {
			headers: {
				'Accept': 'application/json',
				'Authorization': 'bearer ' + global.token,
			},
			method: 'POST',
			body: formData
		}).then((response) =>  {
			console.log(response)
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
		fetch("http://localhost:5000/users/image", requestOptions)
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
			{/* <div>
				<div className='flex w-[100px] flex-column justify-center items-center flex-wrap h-[200px]'>
					<div className='flex w-[60px] flex-wrap h-[120px] justify-center items-center'>
						
						<div className='flex w-[60px] h-[60px] justify-center  items-center'>
							<input id="uploadButton" ref={uploadRef} className='w-[60px] h-[60px] rounded-full invisible absolute' type="file" onChange={onFileChange} /> 
							<FiDownload	className={`w-[60px] h-[60px] rounded-full
													${!preview ? "text-green-400" : "text-blue-400"}
													cursor-pointer
													transition-all duration-300 ease-in-out`}
							onClick={(()=>{
								if(!file){
									let element: HTMLElement = document.getElementById('uploadButton') as HTMLElement;
									element.click();
								}else
									fileUpload()
							})}/>
						</div>
					</div>
				</div>
			</div> */}
		</>
	)
}

export default SettingsProfilPicChoice