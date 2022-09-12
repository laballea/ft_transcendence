import { useSelector } from "react-redux";
import ContactList from "../../contactList/ContactList";
import CreateRoom from "../../message/CreateRoom";
import FloatingMessage from "../../message/FloatingMessage";

function SocialInterface() {
	const global = useSelector((state: any) => state.global)
	return (
		<div className="relative bg-slate-800 w-[400px] flex-col h-full">
			<div className='h-[calc(100%-400px)]'>
				<ContactList/>
			</div>

			<div className='p-4 h-[400px] w-full'>
				<div className='w-full h-full rounded-[8px] shadow-inner bg-slate-900 '>
				{ global.currentConv !== undefined ? <FloatingMessage/> : <CreateRoom/>}
				</div>
			</div>

			{/* {global.createRoom ? <CreateRoom/> : global.currentConv !== undefined && <FloatingMessage/>}
			<ChatBar/> */}
		</div>

 );
}

export default SocialInterface;