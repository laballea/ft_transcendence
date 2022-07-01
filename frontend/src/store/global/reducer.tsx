import { createSlice } from '@reduxjs/toolkit'
import { user, status } from '../../common/types'

const InitialState: user = {
	logged:false,
	username:undefined,
	friendsRequest:[],
	pendingRequest:[],
	clientChat:"",
	convID:undefined,
	conv:[],
	status:"Disconnected",
	token:undefined,
	gameID:undefined
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
			state.pendingRequest = data.payload.user.pendingRequest
			state.userImage = data.payload.user.profilIntraUrl
			state.conv = data.payload.user.conv
			state.gameID = data.payload.user.gameID
		},
		logout: (state: any) => {
			Object.assign(state, InitialState)
		},
		updateDB: (state:any, data:any) => {
			state.status = data.payload.status
			state.friendsRequest = data.payload.friendsRequest
			state.pendingRequest = data.payload.pendingRequest
			state.friends = data.payload.friends
			state.bloqued = data.payload.bloqued
			state.conv = data.payload.conv
			state.gameID = data.payload.gameID
			if (state.convID === -1){
				state.convID = state.conv.find((conv:any) => {
					return conv.users.length === 2 && conv.users.findIndex((user:any) => user.username === state.clientChat) >= 0
				}).id
			}
		},
		setCurrentConv: (state:any, data:any) => {
			var {id, username} = data.payload
			if (id === undefined && username === undefined){
				state.convID = undefined
				state.clientChat = undefined
			}
			else if (id === undefined) {
				let conv = state.conv.find((conv:any) => {
					return conv.users.length === 2 && conv.users.findIndex((user:any) => user.username === username) >= 0
				})
				if (conv === undefined){
					state.clientChat = username
					state.convID = -1;
				}
				else	
					state.convID = conv.id	
			}
			else
				state.convID = id
		},
		setGameStatus: (state:any, data:any) => {
			state.status = data.payload
		},
		gameFound: (state:any, data:any) => {
			state.gameID = data.payload.gameID
			state.status = status.InGame
		},
		gameEnd: (state:any) => {
			state.gameID = undefined
			state.status = status.Connected
		}
	},
})

// Action creators are generated for each case reducer function
export const { login, setGameStatus, logout, updateDB, setCurrentConv, gameFound, gameEnd } = globalSlice.actions

export default globalSlice.reducer