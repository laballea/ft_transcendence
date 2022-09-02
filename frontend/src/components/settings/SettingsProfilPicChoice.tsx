import React, { useState, useEffect, useRef } from 'react'
import { FiDownload, FiEdit2, FiX } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { editProfilPicSocket, editUsernameSocket } from '../../context/socket';

// Assets
type SettingsProfilPicChoiceProps = {
}

const SettingsProfilPicChoice = ({} : SettingsProfilPicChoiceProps) => {
	const global = useSelector((state: any) => state.global)
	const [file, setFile] = React.useState<any>(null);
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
		setFile(event.target.files[0])
		let url = URL.createObjectURL(event.target.files[0])
		setPreview(url)
	};
	const fileUpload = () => {
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
	}, []);

	const profilPicsComp = profilPics.length > 0 ? profilPics.map((url:string, index:number) =>
		<div className='w-[60px] h-[60px] rounded-full m-5' key={index} onClick={()=> {editProfilPicSocket(global, url)}}>
			<img src={url} width="60" height="60" alt="profilpic" className='rounded-full'></img>
		</div>
	): [];

	return (
		<>
			<div className='flex flex-row items-center w-[200px] h-[200px] rounded-full'>
				<div className='w-[100px] overflow-x-scroll h-[200px]'>
					{profilPicsComp}
				</div>
				<div className='flex w-[100px] flex-column justify-center items-center flex-wrap h-[200px]'>
					<div className='flex w-[60px] flex-wrap h-[120px] justify-center items-center'>
						{preview &&
							<div className='w-[60px] h-[60px] relative justify-center  items-center' onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
								<div className='w-[60px] h-[60px] rounded-full border-blue-400 border-4'>
									<img src={preview} width="60" height="60" alt="profilpic" className='rounded-full'></img>
								</div>
								{isHovering &&
									<FiX className='absolute top-[5px] left-[5px] w-[50px] h-[50px] rounded-full text-red-400'
											onClick={()=>{
												setFile(null)
												setPreview(null)
											}}
									/>
								}
								
							</div>
						}
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
			</div>
		</>
	)
}
/*<button onClick={fileUpload}> 
							Upload! 
						</button> */

SettingsProfilPicChoice.defaultProps = {
}


export default SettingsProfilPicChoice