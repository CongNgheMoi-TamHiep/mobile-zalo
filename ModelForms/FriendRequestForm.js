import { useState } from "react";
import { useSocket } from "../context/SocketProvider";

export default function FriendRequestForm() {
    const {socket} = useSocket();
    const [friendRequest, setFriendRequest] = useState(null); 
    useEffect(() => {
        console.log("socket.id: ");
        console.log(socket.id);
        socket.on('receiveFriendRequest', (data) => {
            console.log('receiveFriendRequest: '); 
            console.log(data); 
            setFriendRequest(data);
        })
    }, [])
    return (
        <View>
            <Text> Nhận lời mời kết bạn từ {friendRequest.senderInfo.name} </Text>
        </View>
    )
}