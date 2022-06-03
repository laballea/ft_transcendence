import { createSlice } from '@reduxjs/toolkit'
import { user, status } from '../../common/types'

const InitialState: user = {
	logged:false,
	username:undefined,
	friendsRequest:[]
}

export const globalSlice = createSlice({
	name: 'global',
	initialState:InitialState,
	reducers: {
		login: (state: any, data: any) => {
			state.username = data.payload.user.username
			state.id = data.payload.user.id
			state.status = status.Connected
			state.logged = true
			state.token = data.payload.token
			state.friendsRequest = data.payload.user.friendsRequest

		},
		logout: (state: any) => {
			const requestOptions = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json;charset=utf-8',
					'Access-Control-Allow-Origin': '*',
					'Authorization': 'bearer ' + state.token,
				},
			}
			fetch("http://localhost:5000/users/logout", requestOptions)
				.then(response=>response.text())
				.then(data=>{console.log(data)
			});
			state.username = undefined
			state.id = undefined
			state.status = status.Disconnected
			state.logged = false
			state.token = ""
		},
		sendFriendRequest: (state: any, data: any) => {
			const {socket, username} = data.payload;
			console.log(socket, username)
			/*const requestOptions = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json;charset=utf-8',
					'Access-Control-Allow-Origin': '*',
					'Authorization': "Bearer " + state.token
				},
				body: JSON.stringify(
					{
						id: state.id,
						friendID: data.payload.friendID
					}
				)
			}
			fetch("http://localhost:5000/users/friend", requestOptions)
			.then(async response=>{
				if (response.ok){
					const resp = await response.text()
					console.log(resp)
				}
				else {
					console.log(response);
				}
			})*/
		},
		receiveFriendRequest: (state: any, data:any) => {
			state.friendRequest = data.payload;
		},
		updateDB: (state:any, data:any) => {
			console.log(data.payload);
			state.status = data.payload.status
			state.friendsRequest = data.payload.friendsRequest
			state.friends = data.payload.friends
			state.bloqued = data.payload.bloqued
		},
		acceptFriend: () => {
			console.log("Accept")
		},
		ignoreFriend: () => {
			console.log("Ignore")
		}
	},
})

// Action creators are generated for each case reducer function
export const { login, logout, sendFriendRequest, updateDB, acceptFriend, ignoreFriend } = globalSlice.actions

export default globalSlice.reducer