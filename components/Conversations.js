import React, { useState, useLayoutEffect, useRef, useEffect, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { GiftedChat, Send, Bubble } from "react-native-gifted-chat";
import { InputToolbar } from "react-native-gifted-chat";
import * as ImagePicker from 'expo-image-picker';
import { Video, ResizeMode } from 'expo-av';
import axiosPrivate from "../api/axiosPrivate";
import { auth } from '../config/firebase';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { AntDesign, SimpleLineIcons, Ionicons, MaterialIcons, Entypo, Octicons } from '@expo/vector-icons';
import combineUserId from "../utils/combineUserId";
import axios from "axios";
import { useSocket } from "../context/SocketProvider";
import { useCurrentUser } from "../App";
export default function Conversations({ route, navigation }) {

    // thong tin user tim kiem
    const searchUser = route.params?.searchUser;
    const conversationInfo = route.params?.conversationInfo;
    // kiểm tra xem người  dùng có nhập chữ hay không
    const [isTyping, setIsTyping] = useState(false);
    // hiệu ứng dấu nháy trong phần tin nhắn
    const [isFocused, setIsFocused] = useState(false);
    const [conversation, setConversation] = useState({}); 
    const currentUser = useCurrentUser(); 
    const [chatReceived, setChatReceived] = useState(null);
    const [me, setMe] = useState(null); 
    const {socket} = useSocket();  
    useEffect(()=> {
        const user = axiosPrivate.get(`/user/${currentUser.user.uid}`)
        setMe(user);
    }, [])

    useEffect(() => {
        const convId = conversationInfo?.conversationId || combineUserId(currentUser.user.uid, searchUser?._id);
        socket.emit("joinRoom", convId);
    }, [])

    useEffect(() => {
        socket.on("getMessage", (chat) => {
          setChatReceived(chat); 
        })
      }, []);
    useEffect(() => {
        console.log("hellow asdfsa")
        socket.on('receiveFriendRequest', (data) => {
            console.log('receiveFriendRequest: '); 
            console.log(data); 
            // show model in 4s... 
        })
      }, [])
    
    


    useEffect(() => {
        if (chatReceived) {
            const newMessage = {
                _id: chatReceived?._id || chatReceived.createdAt,
                text: chatReceived.content.text,
                createdAt: new Date(chatReceived.createdAt),
                user: {
                    _id: chatReceived.senderInfo._id,
                    name: chatReceived.senderInfo.name,
                    avatar: chatReceived.senderInfo.avatar
                }
            };
            setMessages(previousMessages => GiftedChat.append(previousMessages, newMessage));
        }
    }, [chatReceived])

    useEffect(() => {
        const conversationInfo = route.params?.conversationInfo;
        // console.log('conversation infoooooooo ==========================')
        const conversationId = conversationInfo?.conversationId;
        (async () => {
            if (conversationId) {
                const chats = await axiosPrivate.get(`/chat/${conversationId}`);
                console.log("chat sau khi lay api vee bang conversation id ==============================")
                const formattedMessages = chats.map(message => ({
                    _id: message._id,
                    text: message.content.text,
                    createdAt: new Date(message.createdAt),
                    user: {
                        _id: message.senderInfo._id,
                        name: message.senderInfo.name,
                        avatar: message.senderInfo.avatar
                    }
                }));
                setMessages(formattedMessages.reverse());
                console.log('MESSAGE ====================================================')
                console.log(messages)
                // setConversation(conversation);
            }
        })();
    }, [])

    // video
    const videoRef = useRef(null);
    // const [isPlaying, setIsPlaying] = useState(false);
    // const [status, setStatus] = useState({});

    // cập nhật trạng thái phát lại của video
    const onPlaybackStatusUpdate = (status) => {
        if (!status.isLoaded) {
            // xử lý nếu cần khi video chưa load
        } else {
            // setIsPlaying(status.isPlaying);

            if (status.didJustFinish) {
                // Nếu video vừa chạy xong, đặt lại vị trí phát lại về đầu
                videoRef.current.setPositionAsync(0);
            }
        }
    };

    const onInputTextChanged = (text) => {
        setIsTyping(text.length > 0);
    };

    const onFocus = () => {
        setIsFocused(true);
    };

    const onBlur = () => {
        setIsFocused(false);
    };

    // xử lí gửi ảnh
    const onSendMedia = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            // base64: false, // disable base64 encoding
            // aspect: [0, 0], // set aspect ratio to 0 to keep original size
            aspect: [0, 0],
            quality: 1,
            multiple: true,
        });

        console.log("ImagePicker result:", result);

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const selectedMedia = result.assets.map((item, index) => {
                const mediaType = item.type ? item.type.toLowerCase() : '';

                return {
                    _id: messages.length + index + 1,
                    type: mediaType, // Đảm bảo type là "video" khi gửi video
                    [mediaType]: item.uri,
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                    },
                };
            });

            console.log("Selected media:", selectedMedia);
auth.currentUser
            onSend(selectedMedia);
        }
    };


    // dữ liệu giả
    const [messages, setMessages] = useState([]);


    // custom header
    useLayoutEffect(() => {
        const originalTitle = `${searchUser?.name || conversationInfo?.name || conversationInfo?.user.name}`; // Sau này đổi thành tên của người trong cùng cuộc hội thoại
        const maxTitleLength = 20; // Số ký tự tối đa bạn muốn hiển thị trước khi cắt
        // Tạo chuỗi tiêu đề được hiển thị (đảm bảo không vượt quá maxTitleLength)
        const displayedTitle = originalTitle.length > maxTitleLength
            ? `${originalTitle.slice(0, maxTitleLength - 3)}...`
            : originalTitle;


        navigation.setOptions({
            title: "", // Đổi tiêu đề
            headerStyle: {
                backgroundColor: '#0C8AFF', // Thay đổi màu nền của header
            },
            headerLeft: () => (
                <View style={{ width: 250, flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                    <AntDesign name="left" size={24} color="white" onPress={() => navigation.goBack()} />
                    <Text
                        style={{
                            marginLeft: 10,
                            width: 215,
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: '#fff',
                            maxWidth: 215, // Giới hạn chiều rộng của Text
                            overflow: 'hidden',
                            //textOverflow: 'ellipsis', // Hiển thị dấu ba chấm khi vượt quá chiều rộng
                        }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {displayedTitle}
                    </Text>
                </View>
            ),
            headerRight: () => (
                <View style={{ width: 120, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <SimpleLineIcons name="phone" size={24} color="white" />
                    <Ionicons name="videocam-outline" size={28} color="white" />
                    <AntDesign name="bars" size={28} color="white" />
                </View>
            )

        });
    }, [navigation, searchUser]);
    // console.log("conversation: ");
    // console.log(conversation);


    // xử lí khi gửi dữ liệu
    const onSend = async (newMessages = []) => {
        const updatedMessages = newMessages.map(message => {
            const { type, image, video, ...rest } = message;

            // Kiểm tra kiểu phương tiện và xử lý dữ liệu tương ứng
            if (type === 'image') {
                return {
                    ...rest,
                    image,
                };
            } else if (type === 'video') {
                return {
                    ...rest,
                    video,
                };
            }

            // Xử lý các trường hợp khác (nếu có)
            return message;
        });

        const { text } = { ...updatedMessages[0] };

        socket.emit("sendMessage", {
            conversationId: conversationInfo?.conversationId || combineUserId(currentUser.user.uid, searchUser?._id),
            senderInfo: {
              _id: currentUser.user.uid,
              name: me.name, 
              avatar: me.avatar, 
            },
            content: { text },
            createdAt: new Date(),
        }); 
        // trường hợp chọn vào userConversation
        let conversationId = conversationInfo?.conversationId;
        if (conversationId) {
            // do nothing for now
            const chat = await axiosPrivate.post(`/chat`, {
                conversationId,
                senderId: currentUser.user.uid,
                content: { text }
            });
            console.log("chat: ");
            console.log(chat);
        } else if( searchUser?._id) {
            const chat = await axiosPrivate.post(`/chat`, {
                receiverId: searchUser._id,
                senderId: currentUser.user.uid,
                content: { text }
            });
            console.log("chat: ");
            console.log(chat);
        } else { 
            console.log("bug!!!!")
        }
    };



    // gửi video
    const renderMessageVideo = (props) => {
        console.log("videoprop:", props.currentMessage.video);
        return (
            <TouchableOpacity
                style={{ position: 'relative', height: 280, width: 250 }}
            >
                <Video
                    ref={videoRef}
                    style={styles.video}
                    source={{
                        uri: props.currentMessage.video,
                    }}
                    useNativeControls
                    resizeMode={ResizeMode.CONTAIN}
                    onPlaybackStatusUpdate={onPlaybackStatusUpdate}
                />
            </TouchableOpacity>
        );
    }


    // chỉnh icon gửi tin nhắn
    const renderSend = (props) => {

        if (!isTyping) {
            return (
                <View>
                    {/* Icon khác khi không có tin nhắn */}
                    <View style={{ width: 120, height: '100%', marginRight: 20, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#F6F6F6' }}>
                        <Entypo
                            name="dots-three-horizontal"
                            size={24}
                            color="grey"
                            style={{
                                marginTop: 5
                            }}
                        />
                        <SimpleLineIcons
                            name="microphone"
                            size={24}
                            color="grey"
                            style={{
                                marginTop: 5
                            }}
                        />
                        <Octicons
                            name="image"
                            size={24}
                            color="grey"
                            style={{
                                marginTop: 5
                            }}
                            onPress={onSendMedia}
                        />
                    </View>

                </View>
            );
        }

        return (
            <Send {...props}>
                <View>
                    <MaterialCommunityIcons
                        name="send-circle"
                        style={{ marginBottom: 5, marginRight: 5 }}
                        size={38}
                        color={'#2e64e5'}
                    />
                </View>
            </Send>
        );
    };

    // cái này dùng để custom bóng chat

    const renderBubble = (props) => {
        const { user, createdAt, text, image, video } = props.currentMessage;

        // Kiểm tra nếu là tin nhắn hình ảnh
        if (image) {
            return (
                <Bubble
                    {...props}
                    imageStyle={{
                        width: 250,
                        height: 300,
                        borderRadius: 20,
                    }}
                    wrapperStyle={{
                        right: {
                            backgroundColor: '#F2F2F2',

                        },
                        left: {
                            backgroundColor: '#fff',
                        }
                    }}
                />
            );
        }

        if (video) {
            return (
                <Bubble
                    {...props}
                    videoStyle={{
                        width: 250,
                        height: 300,
                        borderRadius: 0,
                    }}
                    wrapperStyle={{
                        right: {
                            backgroundColor: '#F2F2F2'
                        },
                        left: {
                            backgroundColor: '#fff'
                        }
                    }}
                />
            );
        }
        // Nếu là tin nhắn text
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#0084FF',
                    },
                    left: {
                        backgroundColor: '#fff'
                    }
                }}
                textStyle={{
                    right: {
                        color: '#fff'
                    },
                    left: {
                        color: '#000'
                    }
                }}
            />
        );
    };

    // chỉnh icon ở bên trái phần nhập tin nhắn
    const renderAction = () => (
        <TouchableOpacity
            style={{ width: 30, height: '100%', alignItems: 'center', marginLeft: 10 }}
        >
            <MaterialIcons name="collections" size={26} color="grey" style={{ marginTop: 5 }} />
        </TouchableOpacity>
    )

    const renderInputToolBar = (props) => {
        return (
            <InputToolbar
                containerStyle={{
                    backgroundColor: '#f6f6f6',
                    borderColor: isFocused ? '#2e64e5' : '#f6f6f6', // Màu viền khi focus
                    borderWidth: 1,
                }}
                {...props}
                keyboardShouldPersistTaps={isFocused ? 'always' : 'never'}
            />
        )
    }

    // Giao diện
    return (
        <GiftedChat
            messages={messages}
            onSend={newMessages => onSend(newMessages)}
            onInputTextChanged={onInputTextChanged}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder="Messages"
            user={{
                _id: currentUser.user.uid,
            }}
            timeTextStyle={{ left: { color: '#95999A' }, right: { color: '#F0F0F0' } }} // Màu của thời gian
            renderBubble={renderBubble} // custom màu bóng chat
            renderSend={renderSend} // custom icon gửi thay vì chữ SEND
            renderMessageVideo={renderMessageVideo} // dùng để gửi video
            renderUsernameOnMessage={true} // hiện tên người gửi bên dưới nội dung
            renderInputToolbar={renderInputToolBar} // custom thanh bar của tin nhắn
            renderActions={renderAction} // chỉnh icon kế bên ô nhập tin nhắn
        />
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center'
    },
    video: {
        position: 'absolute',
        left: 0,
        top: 0,
        height: 300,
        width: 250,
        borderRadius: 20,
    }
});