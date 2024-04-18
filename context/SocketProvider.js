import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useCurrentUser } from "../App";
export const SocketContext = createContext();

const SocketProvider = ({children}) => {
    // const socket = io('https://tamhiep.zola-api.tech', {transports: ['websocket']}); 
    const socket = io('http://192.168.30.250:8900', {transports: ['websocket']});
    const [socketValue, setSocketValue] = useState(socket);
    const currentUser =  useCurrentUser().user;
    useEffect(() => {
        socket.on('connect', () => {
            setSocketValue(socket);
        })
        if(currentUser?.uid)
            socket.emit('addUser', currentUser?.uid);
    }, [currentUser?.uid])

    return (
        <SocketContext.Provider value={{socket:socketValue}}>
            {children}
        </SocketContext.Provider>
    )
}

export const useSocket = () => useContext(SocketContext);
export default SocketProvider;