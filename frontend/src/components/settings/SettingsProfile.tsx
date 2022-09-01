import React, { useState } from 'react'
import { FiEdit2 } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { editUsernameSocket } from '../../context/socket';

// Assets
type SettingsProfileProps = {
	username: string,
	userImage: string
}

const SettingsProfile = ({username, userImage} : SettingsProfileProps) => {
	const navigate = useNavigate();
	const global = useSelector((state: any) => state.global)
	const backtext : string = "<- back";
	const [editUsername, setEditUsername] = useState(false);
	const [editProfilPic, setEditProfilPic] = useState(false);
	const [file, setFile] = React.useState<any>();
	const [newUsername, setNewUsername] = useState(username);

	const onFileChange = (event:any) => { 
		setFile(event.target.files[0])
	}; 
	const fileUpload = (e:any) => {
		const formData = new FormData();
		console.log(file.filename)
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
			return response.text();
		 })
	}
	return (
		<>
			<div className='flex items-center justify-self-stretch'>
				<button 
					className="font-space w-24  text-slate-400 pr-4"
					onClick={ () => navigate("/app") }> 
					{ backtext }
				</button>
				<div  className='w-full border h-[2px] border-slate-700'></div>
			</div>
			<h2 className='font-pilowlava text-[64px] text-transparent backgroundTextOutline'>Profile</h2>
			<div className='flex items-center gap-[40px]'>
				<div className=''>
					<div className='absolute z-10 w-[200px] h-[200px] rounded-full flex items-center justify-center
									text-slate-200 bg-slate-800/50
									opacity-0 hover:opacity-100
									cursor-pointer
									transition-all duration-300 ease-in-out'>
						<FiEdit2 size='24px' onClick={() => {setEditProfilPic(!editProfilPic)}}/>
						{editProfilPic && 
							<div className='w-[200px] h-[200px] rounded-full'> 
								<input type="file" onChange={onFileChange} /> 
								<button onClick={fileUpload}> 
									Upload! 
								</button> 
						 	</div> 
						}
					</div>
					<div className='w-[200px] h-[200px] rounded-full'>
						<img src={userImage} width="200" height="200" alt="userimage" className='rounded-full'></img>
					</div>
				</div>
				<div className='flex items-center gap-[8px] 
								text-slate-400 hover:text-slate-200 font-space text-[40px]
								cursor-pointer
								transition-all duration-300 ease-in-out'
								>
					{editUsername ?
					      <input
								className="flex"
								type="text"
								placeholder={username}
								value={newUsername}
								onChange={(event)=>setNewUsername(event.target.value)}
								name="content"
							/>
						:
						<p onClick={() => setEditUsername(true)}> { username }</p>
					}
					<FiEdit2 size='24px' onClick={() => {
						if (editUsername) {
							editUsernameSocket(global, newUsername)
						}
						setEditUsername(!editUsername)}}
					/>
				</div>
			</div>
			<div className='mb-[64px]'></div>
		</>
	)
}


SettingsProfile.defaultProps = {
}


export default SettingsProfile