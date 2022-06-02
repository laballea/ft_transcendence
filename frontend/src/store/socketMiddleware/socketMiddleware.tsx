import { Middleware } from 'redux'
import { io } from 'socket.io-client';
import { acceptFriend, login, logout, receiveFriendRequest } from '../global/reducer';
import { socketActions } from './socketSlice';

const socketMiddleware: Middleware = store => {
	let socket: any = undefined; 

	return next => (action:any) => {
		const isConnectionEstablished = socket && store.getState().socket.isConnected;
		console.log("here", socket === undefined,  store.getState().global)
		if (socket === undefined && login.match(action)) {
			console.log("here")
			socket = io("http://localhost:5000/").connect(); // set token here

			socket.on('loggin', (data: {}) => {
				store.dispatch(socketActions.connectionEstablished());
				socket.emit('setID', {socketID:socket.id, id:store.getState().global.id});
			})

			socket.on('friendRequest', (data:number[]) => {
				store.dispatch(receiveFriendRequest(data));
			})
		}
		if (acceptFriend.match(action) && isConnectionEstablished) {
			socket.emit('acceptFriend', {socketID:socket.id, id:store.getState().global.id})
		}
		if (logout.match(action) && isConnectionEstablished) {
			socket.disconnect();
			socket = undefined;
			localStorage.clear();
		}
		next(action);

	}
}
 
export default socketMiddleware;