import { createSlice } from '@reduxjs/toolkit'
import { user, status } from '../../common/types'

const InitialState: user = {
	logged:false,
	username:undefined,
	friendRequest:[]
}

export const globalSlice = createSlice({
	name: 'global',
	initialState:InitialState,
	reducers: {
		login: (state: any, data: any) => {
			console.log("state", state)
			state.username = data.payload.username
			state.id = data.payload.id
			state.status = status.Connected
			state.logged = true
			state.token = data.payload.token
			state.friendRequest = []

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
			const requestOptions = {
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
			})
		},
		receiveFriendRequest: (state: any, data:any) => {
			state.friendRequest = data.payload;
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
export const { login, logout, sendFriendRequest, receiveFriendRequest, acceptFriend, ignoreFriend } = globalSlice.actions

export default globalSlice.reducer