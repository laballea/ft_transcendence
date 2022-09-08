import { createSlice } from '@reduxjs/toolkit'
import { user, status, gamemode } from '../../common/types'
import getProfilImg from '../../components/commons/utils/getProfilImg'

const InitialState: user = {
	logged:false,
	lvl:0,
	username:undefined,
	friendsRequest:[],
	pendingRequest:[],
	clientChat:"",
	convID:undefined,
	roomID:undefined,
	conv:[],
	room:[],
	status:"Disconnected",
	token:undefined,
	gameID:undefined,
	challenged:undefined,
	contactList:[],
	gamemode:gamemode.normal,
	twoFactor:false,
	currentConv:undefined,
	createRoom:false,
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
			state.userImage = getProfilImg(data.payload.user.profilPic)
			state.conv = data.payload.user.conv.concat(data.payload.user.room)
			state.room = data.payload.user.room
			state.gameID = data.payload.user.gameID
			state.twoFactor = data.payload.twoFactor
			state.lvl = data.payload.user.lvl
		},
		logout: (state: any) => {
			Object.assign(state, InitialState)
		},
		updateDB: (state:any, data:any) => {
			state.username = data.payload.username
			state.status = data.payload.status
			state.friendsRequest = data.payload.friendsRequest
			state.pendingRequest = getProfilImg(data.payload.pendingRequest)
			state.userImage = data.payload.profilPic
			state.friends = data.payload.friends
			state.blocked = data.payload.blocked
			state.conv = data.payload.conv.concat(data.payload.room)
			state.gameID = data.payload.gameID
			state.twoFactor = data.payload.twoFactor
			state.lvl = data.payload.lvl
			if (state.currentConv !== undefined && state.currentConv !== -1)
				state.currentConv = state.conv.find((conv:any) => conv.adminId === state.currentConv.adminId && conv.id === state.currentConv.id)
			if (state.convID === -1){
				state.convID = state.conv.find((conv:any) => {
					return conv.users.length === 2 && conv.users.findIndex((user:any) => user.username === state.clientChat) >= 0
				}).id
			}
			if (state.currentConv === -1){
				state.currentConv = state.conv.find((conv:any) => {
					return conv.users.length === 2 && conv.users.findIndex((user:any) => user.username === state.clientChat) >= 0
				})
			}
			state.room = data.payload.room
		},
		setCurrentConv: (state:any, data:any) => {
			var {username, conv} = data.payload
			if ((conv === undefined && username === undefined) || (state.currentConv && conv != undefined && state.currentConv.id === conv.id)){
				state.currentConv = undefined
				state.clientChat = undefined
			}
			else if (conv === undefined) {
				let tmp_conv = state.conv.find((conv:any) => {
					return conv.users.length === 2 && conv.users.findIndex((user:any) => user.username === username) >= 0
				})
				if (tmp_conv === undefined){
					state.clientChat = username
					state.currentConv = -1;
				}
				else
					state.currentConv = tmp_conv
				
			} else
				state.currentConv = conv
		},
		setCurrentRoom: (state:any, data:any) => {
			var {id} = data.payload
			if (id === undefined  || state.roomID === id){
				state.roomID = undefined
			} else {
				state.roomID = id
			}
		},
		setContactList: (state:any, data:any) => {
			state.contactList = data.payload
		},
		setGameStatus: (state:any, data:any) => {
			state.status = data.payload
		},
		gameFound: (state:any, data:any) => {
			state.gameID = data.payload.gameID
			state.gamemode = data.payload.mode
			state.status = status.InGame
		},
		gameEnd: (state:any) => {
			state.gameID = undefined
			state.status = status.Connected
		},
		spectate: (state:any, data) => {
			state.gameID = data.payload
			state.status = status.Spectate
		},
		challenged: (state:any, data) => {
			state.challenged = data.payload.who
		},
		setGameMode: (state:any, data:any) => {
			state.gamemode = data.payload
		},
		setCreateRoom: (state:any, data:any) => {
			state.createRoom = !state.createRoom
		},
	},
})

// Action creators are generated for each case reducer function
export const {
	login,
	setGameStatus,
	logout,
	updateDB,
	setCurrentConv,
	setCurrentRoom,
	gameFound,
	gameEnd,
	spectate,
	challenged,
	setContactList,
	setGameMode,
	setCreateRoom
	} = globalSlice.actions

export default globalSlice.reducer