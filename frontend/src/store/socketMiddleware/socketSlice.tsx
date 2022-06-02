import { createSlice } from '@reduxjs/toolkit';
 
export interface SocketState {
  isEstablishingConnection: boolean;
  isConnected: boolean;
  isLogin: boolean;
}
 
const initialState: SocketState = {
  isEstablishingConnection: false,
  isConnected: false,
  isLogin: false

};
 
const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    startConnecting: (state => {
      state.isEstablishingConnection = true;
    }),
    connectionEstablished: (state => {
      state.isConnected = true;
      state.isEstablishingConnection = true;
    }),
  },
});
 
export const socketActions = socketSlice.actions;
 
export default socketSlice;