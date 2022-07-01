// Hooks
import React from 'react'

// Types
import { status } from '../../common/types';

type ContactInfoProps = {
	Contact: {
		username:string,
		id:number,
		status:status,
		
	},
	userImage:string
}

const ContactInfo = ({Contact, userImage} : ContactInfoProps) => {

	if (Contact.status === status.Connected)
	{
		console.log("Connected: " + Contact.username)
		return (
			<>
				{/* On click go to profile */}
					<div className='flex items-center w-full h-full'>
						{/* Fetch image */}
						<div className="border-2 border-green-500 rounded-full ml-[8px]">
							<img src={userImage} width="40" height="40" alt="userimage" className='rounded-full'></img>
						</div>
						<div className="ml-[16px]">
							<p className='absolute mt-[-8px] text-green-500 font-space text-[10px]'>{Contact.status}</p>
							<p className='font-space text-slate-400 text-[20px]'>
								{Contact.username}
							</p>
						</div>
					</div>
			</>
		)
	}
	else if (Contact.status === status.InGame || Contact.status === status.InQueue)
	{
		return (
			<>
				{/* On click go to profile */}
					<div className='flex items-center w-full h-full'>
						{/* Fetch image */}
						<div className="border-2 border-yellow-500 rounded-full ml-[8px]">
							<img src={userImage} width="40" height="40" alt="userimage" className='rounded-full'></img>
						</div>
						<div className="ml-[16px]">
							<p className='absolute mt-[-8px] text-yellow-500 font-space text-[10px]'>{Contact.status}</p>
							<p className='font-space text-slate-400 text-[20px]'>
								{Contact.username}
							</p>
						</div>
					</div>
			</>
		)

	}
	else 
	{
		console.log("DISConnected: " + Contact.status + status.Connected)
		return (
			<>
				{/* On click go to profile */}
					<div className='flex items-center w-full h-full'>
						{/* Fetch image */}
						<div className="border-2 border-transparent rounded-full ml-[8px]">
							<img src={userImage} width="40" height="40" alt="userimage" className='rounded-full'></img>
						</div>
						<div className="ml-[16px]">
							<p className='font-space text-slate-400/50 text-[20px]'>
								{Contact.username}
							</p>
						</div>
					</div>
			</>
		)
	}
}

export default ContactInfo