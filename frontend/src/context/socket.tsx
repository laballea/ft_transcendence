import {io, Socket} from "socket.io-client";
import React from "react";
import { FRIEND_REQUEST_ACTIONS } from "../common/types";

export const socket:Socket = io("http://localhost:5000/", {autoConnect: false, reconnection: false});
export const SocketContext = React.createContext(socket);

export function acceptFriendRequest(global:any, username:string) {
	socket.emit("FRIEND_REQUEST", {
		action: FRIEND_REQUEST_ACTIONS.ACCEPT,
		client_send: global.username,
		client_recv: username,
		jwt:global.token
	})
}

export function declineFriendRequest(global:any, username:string) {
	socket.emit("FRIEND_REQUEST", {
		action: FRIEND_REQUEST_ACTIONS.DECLINE,
		client_send: global.username,
		client_recv: username,
		jwt:global.token
	})
}

export function removeFriend(global:any, username:string) {
	socket.emit("FRIEND_REQUEST", {
		action: FRIEND_REQUEST_ACTIONS.REMOVE,
		client_send: global.username,
		client_recv: username,
		jwt:global.token
	})
}

export function addFriend(global:any, username:string) {
	socket.emit("FRIEND_REQUEST", {
		action: FRIEND_REQUEST_ACTIONS.ADD,
		client_send: global.username,
		client_recv: username,
		jwt:global.token
	})
}

export function challenged(action:string, global:any, id:number) {
	socket.emit("CHALLENGED", {
		action: action,
		mode:global.gamemode,
		asking: global.id,
		receiving: id,
		jwt:global.token
	})
}

export function spectateGame(global:any, clientId:number,spectateId:number) {
	socket.emit("SPECTATE", {
		clientId,
		spectateId,
		jwt:global.token
	})
}

export function mouseClickSocket(global:any, pos:{x:number, y:number}) {
	socket.emit("MOUSE_CLICK", {
		pos,
		id:global.id,
		gameID:global.gameID,
		jwt: global.token
	})
}

export function editUsernameSocket(global:any, newUsername:string) {
	socket.emit("EDIT_USERNAME", {
		newUsername,
		id:global.id,
		jwt: global.token
	})
}

export function editProfilPicSocket(global:any, url:string) {
	socket.emit("EDIT_PROFILPIC", {
		url,
		id:global.id,
		jwt: global.token
	})
}

export function changePass(global:any,roomId:number, userId:number, oldPass:string, newPass:string) {
	socket.emit('changePassRoom', {
		roomId: roomId,
		admin: global.username,
		oldPass: oldPass,
		newPass: newPass,
		jwt: global.token
	});
}

export function deleteMember(global:any, roomId:number, userId:number) {
	socket.emit('deleteMember', {
		roomId: roomId,
		userId: userId,
		admin: global.username,
		jwt: global.token
	});
}

export function banMember(global:any, roomId:number, userId:number) {
	socket.emit('banMember', {
		roomId: roomId,
		userId: userId,
		admin: global.username,
		jwt: global.token
	});
}

export function muteMember(global:any, roomId:number, userId:number, endDate:string) {
	console.log("date:", Date().toString(), " endDate:", endDate)
	socket.emit('muteMember', {
		roomId: roomId,
		userId: userId,
		admin: global.username,
		endDate: endDate,
		jwt: global.token
	});
}

export function unmutedMember(global:any, roomId:number, userId:number) {
	socket.emit('unmuteMember', {
		roomId: roomId,
		userId: userId,
		admin: global.username,
		jwt: global.token
	});
}

export function upgradeMember(global:any, roomId:number, userId:number) {
	socket.emit('upgradeMember', {
		roomId: roomId,
		userId: userId,
		admin: global.username,
		jwt: global.token
	});
}

export function downgradeMember(global:any, roomId:number, userId:number) {
	socket.emit('downgradeMember', {
		roomId: roomId,
		userId: userId,
		admin: global.username,
		jwt: global.token
	});
}

export function newChatRoom(global:any, name:string, password:string) {
	socket.emit('newChatRoom', {
		name,
		password,
		admin: global.username,
		jwt: global.token
	});
}

export function joinRoomSocket(global:any, joinRoom:string, passRoom:string) {
	socket.emit('joinRoom', {
		joinRoom,
		passRoom,
		user: global.username,
	});
}