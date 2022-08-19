import {io, Socket} from "socket.io-client";
import React from "react";
import { FRIEND_REQUEST_ACTIONS } from "../common/types";

export const socket:Socket = io("http://localhost:5000/", {autoConnect: false, reconnection: false});
export const SocketContext = React.createContext(socket);

export function acceptFriendRequest(global:any, username:string){
	socket.emit("FRIEND_REQUEST", {
		action: FRIEND_REQUEST_ACTIONS.ACCEPT,
		client_send: global.username,
		client_recv: username,
		jwt:global.token
	})
}

export function declineFriendRequest(global:any, username:string){
	socket.emit("FRIEND_REQUEST", {
		action: FRIEND_REQUEST_ACTIONS.DECLINE,
		client_send: global.username,
		client_recv: username,
		jwt:global.token
	})
}

export function removeFriend(global:any, username:string){
	socket.emit("FRIEND_REQUEST", {
		action: FRIEND_REQUEST_ACTIONS.REMOVE,
		client_send: global.username,
		client_recv: username,
		jwt:global.token
	})
}

export function addFriend(global:any, username:string){
	socket.emit("FRIEND_REQUEST", {
		action: FRIEND_REQUEST_ACTIONS.ADD,
		client_send: global.username,
		client_recv: username,
		jwt:global.token
	})
}

export function challenged(action:string,global:any, id:number){
	socket.emit("CHALLENGED", {
		action: action,
		mode:global.gamemode,
		asking: global.id,
		receiving: id,
		jwt:global.token
	})
}

export function spectateGame(global:any,clientId:number,spectateId:number){
	socket.emit("SPECTATE", {
		clientId,
		spectateId,
		jwt:global.token
	})
}

export function mousemoveSocket(global:any,dirx:number){
	socket.emit("MOUSE_MOVE", {
		dirx,
		id:global.id,
		gameID:global.gameID,
		jwt: global.token
	})
}