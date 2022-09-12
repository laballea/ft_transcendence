import { useSelector } from "react-redux";
import ContactList from "../../contactList/ContactList";
import CreateRoom from "../../message/CreateRoom";
import FloatingMessage from "../../message/FloatingMessage";

function SocialInterface() {
	const global = useSelector((state: any) => state.global)
	return (
		<div className="relative bg-slate-800 w-[400px] h-full flex flex-col">
			<div className='w-full flex-grow flex-shrink basis-auto overflow-scroll'>
				<ContactList/>
			</div>

			<div className='p-4 h-[400px] w-full flex-grow-0 basic-[400px] flex-shrink-0'>
				<div className='w-full h-full rounded-[8px] shadow-innerXL bg-slate-900 '>
				{ global.currentConv !== undefined ? <FloatingMessage/> : <CreateRoom/>}
				</div>
			</div>

			{/* {global.createRoom ? <CreateRoom/> : global.currentConv !== undefined && <FloatingMessage/>}
			<ChatBar/> */}
		</div>

 );
}

export default SocialInterface;