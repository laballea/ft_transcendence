import { createSlice } from '@reduxjs/toolkit'
import { user, status } from '../../common/types'

const InitialState: user = {
	logged:false,
	username:undefined,
	friendsRequest:[],
	clientChat:"",
	convID:undefined,
	roomID:undefined,
	conv:[],
	room:[],
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
			state.userImage = data.payload.user.profilIntraUrl
			state.conv = data.payload.user.conv
			state.room = data.payload.user.room
		},
		logout: (state: any) => {
			state = InitialState
		},
		updateDB: (state:any, data:any) => {
			state.status = data.payload.status
			state.friendsRequest = data.payload.friendsRequest
			state.friends = data.payload.friends
			state.bloqued = data.payload.bloqued
			state.conv = data.payload.conv
			if (state.convID == -1){
				state.convID = state.conv.find((conv:any) => {
					return conv.users.length == 2 && conv.users.findIndex((user:any) => user.username == state.clientChat) >= 0
				}).id
			}
			state.room = data.payload.room
		},
		setCurrentConv: (state:any, data:any) => {
			var {id, username} = data.payload
			if (id == undefined) {
				let conv = state.conv.find((conv:any) => {
					return conv.users.length == 2 && conv.users.findIndex((user:any) => user.username == username) >= 0
				})
				if (conv == undefined){
					state.clientChat = username
					state.convID = -1;
				}
				else
					state.convID = conv.id
				
			} else
				state.convID = id
		},
		setCurrentRoom: (state:any, data:any) => {
			var {id, username} = data.payload
			if (id == undefined) {
				let room = state.room.find((room:any) => {
					return room.users.length == 2 && room.users.findIndex((user:any) => user.username == username) >= 0
				})
				if (room == undefined){
					state.clientChat = username
					state.roomID = -1;
				}
				else
					state.roomID = room.id
				
			} else
				state.roomID = id
		},
	},
})

// Action creators are generated for each case reducer function
export const { login, logout, updateDB, setCurrentConv, setCurrentRoom } = globalSlice.actions

export default globalSlice.reducer