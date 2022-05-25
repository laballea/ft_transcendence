import React from 'react'



const Footer = () => {

  	return (
		<>
			<div className="hidden absolute bottom-0 sm:flex justify-center items-center -z-5 w-screen h-[48px]">
					<p className="font-space text-transparent text-[16px] text-slate-600 text-center break-words">
						Made with typescript by&nbsp;
						<a className="text-slate-400 hover:text-slate-200 transition-all duration-300 ease-in-out" href="https://profile.intra.42.fr/users/cmeunier">cmeunier</a>,&nbsp;
						<a className="text-slate-400 hover:text-slate-200 transition-all duration-300 ease-in-out" href="https://profile.intra.42.fr/users/laballea">laballea</a> and&nbsp;
						<a className="text-slate-400 hover:text-slate-200 transition-all duration-300 ease-in-out" href="https://profile.intra.42.fr/users/qgimenez">qgimenez</a>
					</p>
			</div>
		</>
	)
}

export default Footer
