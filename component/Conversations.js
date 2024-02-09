import React, { useState, useLayoutEffect, useRef, useEffect } from "react";
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
export default function Conversations({ route, navigation }) {

    // thong tin user tim kiem
    const searchUser = route.params?.searchUser;
    const conversationInfo = route.params?.conversationInfo;
    // kiểm tra xem người  dùng có nhập chữ hay không
    const [isTyping, setIsTyping] = useState(false);
    // hiệu ứng dấu nháy trong phần tin nhắn
    const [isFocused, setIsFocused] = useState(false);
    const [conversation, setConversation] = useState({});

    useEffect(() => {
        (async () => {
            const conversationId = conversationInfo?.conversationId;
            if (conversationId) {
                const conversation = await axiosPrivate.get(`/conversation/${conversationId}`);
                // console.log(conversation)
                // console.log("conversation")
                setConversation(conversation);
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

            onSend(selectedMedia);
        }
    };


    // dữ liệu giả
    const [messages, setMessages] = useState([]);

    //  đang code chưa xong.................

    useEffect(() => {
        console.log(messages)
    }, [messages])

    // custom header
    useLayoutEffect(() => {
        const originalTitle = `${searchUser?.name || conversationInfo?.userName}`; // Sau này đổi thành tên của người trong cùng cuộc hội thoại
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
    }, [navigation, searchUser, conversation]);
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

        // trường hợp chọn vào userConversation
        let conversationId = conversationInfo?.conversationId;
        const currentUserInfo = await axiosPrivate(`/user/${auth.currentUser.uid}`);
        const searchUserInfo = await axiosPrivate(`/user/${searchUser?._id || conversationInfo?.userId}`); 
        // console.log("currentUserInfo: ")
        // console.log(currentUserInfo)
        
        if (conversationId) {
            // do nothing for now
        }
        // trường hợp chọn vào user
        else {
            conversationId = combineUserId(auth.currentUser.uid, searchUser._id);
            const conversation1 = await axiosPrivate(`conversation/${conversationId}`);
            
            // đã có conversation
            if (conversation1?._id) {
                setConversation(conversation1);
                console.log("đã có conversation");
            }

            // chưa có conversation
            else {
                const savedConversation = await axiosPrivate.post(`/conversation`, {
                    _id: conversationId,
                    type: 'couple',
                    members: [
                        {
                            _id: currentUserInfo._id,
                            name: currentUserInfo.name,
                            avatar: currentUserInfo.avatar
                        }, {
                            _id: searchUserInfo._id,
                            name: searchUserInfo.name,
                            avatar: searchUserInfo.avatar
                        }
                    ]
                })
                setConversation(savedConversation);
            }
        }

        // tạo new chat
        const chat = await axiosPrivate.post(`/chat`, {
            conversationId,
            senderInfo: {
                _id: currentUserInfo._id,
                avatar: currentUserInfo.avatar,
                name: currentUserInfo.name
            },
            content: { text }
        });

        console.log("chat: ");
        console.log(chat);

        // update userConversations cho các members (ở đây chỉ xử lý trường hợp couple)
        // console.log("conversation: ")
        // console.log(conversation)
        for (let member of conversation.members) {
            let avatar = member._id !== currentUserInfo._id ? currentUserInfo.avatar : searchUserInfo?.avatar
            let userName = member._id !== currentUserInfo._id ? currentUserInfo.name : searchUserInfo?.name
            let userId = searchUserInfo?._id ; 
            let lastMess = { 
                _id: chat._id,
                senderInfo: chat.senderInfo,
                owner: member._id === currentUserInfo._id,
                content: {text}, 
                createdAt: chat.createdAt, 
            }
            // console.log("lastMess: ")
            // console.log(lastMess)
            await axiosPrivate.patch(`/userConversations/add-conversation/${member._id}`,
                {
                    userId, 
                    userName,
                    conversationId,
                    lastMess,
                    watched: false, 
                    avatar
                }
            );
        }



        // try {
        //     // bây giờ khi tìm kiếm cần xác định được rằng đã chat hay chưa chat
        //     const conversationsId = route.params?.conversationId; // chổ này là định lấy id của conversation đã chat rồi(nhưng hiện tại thì do chưa chat nên không lấy được)
        //     const userId = auth.currentUser.uid;
        //     const chats = await axiosPrivate(`/chat/${conversationsId}`);

        //     if (chats.length === 0) {
        //         const newConversation = await axiosPrivate.post(`/conversation`, {
        //             type: 'couple',
        //             members: [auth.currentUser.uid, searchUser._id]
        //         });

        //         console.log('===============================================')
        //         console.log('new conversation ID:');
        //         console.log(newConversation._id);

        //         const newConversationId = newConversation._id;
        //         console.log(auth.currentUser.uid)

        //         // Bắt đầu try...catch block để xử lý lỗi Axios
        //         try {
        //             await axiosPrivate.post(`/chat`, {
        //                 conversationsId: newConversationId,
        //                 senderInfo: {
        //                     userId: userId,
        //                     content: {
        //                         text: updatedMessages
        //                     },
        //                     createdAt: new Date()
        //                 }
        //             });

        //             // Các bước khác ở đây...

        //             setMessages(GiftedChat.append(messages, updatedMessages));
        //         } catch (error) {
        //             console.error('Error sending chat message:', error);
        //         }
        //     }
        // } catch (error) {
        //     console.error('Error fetching chat:', error);
        // }
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
                _id: 2,
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