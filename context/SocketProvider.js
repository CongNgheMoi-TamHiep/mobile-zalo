import { createContext, useContext, useEffect } from "react";
import { auth } from "../config/firebase";
import { io } from "socket.io-client";
export const SocketContext = createContext();

const SocketProvider = ({children}) => {
    const socket = io('https://tamhiep.zola-api.tech', {transports: ['websocket']}); 
    const currentUser = auth.currentUser;
    useEffect(() => {
        if(currentUser?.uid)
            socket.emit('addUser', currentUser?.uid);
    }, [currentUser?.uid])
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

export const useSocket = () => useContext(SocketContext);
export default SocketProvider;