import {io, Socket} from "socket.io-client";
import React from "react";

export const socket:Socket = io("http://localhost:5000/", {autoConnect: false, reconnection: false});
export const SocketContext = React.createContext(socket);
