import { createSlice } from '@reduxjs/toolkit'
import { user, status } from '../../common/types'

const InitialState: user = {
	logged:false,
	username:undefined
}

export const globalSlice = createSlice({
	name: 'global',
	initialState:InitialState,
	reducers: {
		login: (state: any, data: any) => {
			state.username = data.payload.username
			state.status = status.Connected
			state.logged = true
			state.token = data.payload.token
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
				.then(data=>{
					console.log(data)
			});
			state.username = undefined
			state.status = status.Disconnected
			state.logged = false
			state.token = ""
		}
	},
})

// Action creators are generated for each case reducer function
export const { login, logout } = globalSlice.actions

export default globalSlice.reducer