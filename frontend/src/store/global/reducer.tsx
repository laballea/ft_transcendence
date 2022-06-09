import { createSlice, current } from '@reduxjs/toolkit'
import { user, status } from '../../common/types'

const InitialState: user = {
	logged:false,
	username:undefined,
	friendsRequest:[],
	clientChat:"",
	convID:undefined,
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
		},
		logout: (state: any) => {
			state.username = undefined
			state.id = undefined
			state.status = status.Disconnected
			state.logged = false
			state.token = undefined
		},
		updateDB: (state:any, data:any) => {
			state.status = data.payload.status
			state.friendsRequest = data.payload.friendsRequest
			state.friends = data.payload.friends
			state.bloqued = data.payload.bloqued
			state.conv = data.payload.conv
		},
		setCurrentConv: (state:any, data:any) => {
			const {id, username} = data.payload // name of conv
			if (id == undefined) {
				state.convID = state.conv.find((conv:any) => {
					return conv.users.findIndex((user:any) => user.username == username) >= 0
				}).id
			} else {
				state.convID = id
			}
			state.clientChat = username
		},
	},
})

// Action creators are generated for each case reducer function
export const { login, logout, updateDB, setCurrentConv } = globalSlice.actions

export default globalSlice.reducer