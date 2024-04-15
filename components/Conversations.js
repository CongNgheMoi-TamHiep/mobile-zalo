import React, { useState, useLayoutEffect, useRef, useEffect, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking, Dimensions } from "react-native";
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
import mime from "mime";
import Modal from "react-native-modal";
import { set } from "date-fns";
import * as DocumentPicker from 'expo-document-picker';


export default function Conversations({ route, navigation }) {

    // width và height của thiết bị
    const { widthOfDevice, heightOfDevice } = Dimensions.get('window');

    // dữ liệu giả
    const [messages, setMessages] = useState([]);

    const [isModalErrorFileSizeVisible, setIsModalErrorFileSizeVisible] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [isModalImageVisible, setModalImageVisible] = useState(false);
    const [isModalVideoVisible, setModalVideoVisible] = useState(false);
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
    const [isConfirmModalImageVisible, setIsConfirmModalImageVisible] = useState(false);
    const [isConfirmModalVideoVisible, setIsConfirmModalVideoVisible] = useState(false);


    // theo dõi vị trí của tin nhắn, hình ảnh, video cần hiện modal
    const [messageLength, setMessageLength] = useState(0);
    const [selectedMessage, setSelectedMessage] = useState('');


    // thong tin user tim kiem
    const searchUser = route.params?.searchUser;
    const conversationInfo = route.params?.conversationInfo;
    console.log("object conversationInfo: ", conversationInfo);
    // kiểm tra xem người  dùng có nhập chữ hay không
    const [isTyping, setIsTyping] = useState(false);
    // hiệu ứng dấu nháy trong phần tin nhắn
    const [isFocused, setIsFocused] = useState(false);
    const [conversation, setConversation] = useState({});
    const currentUser = useCurrentUser();
    const [chatReceived, setChatReceived] = useState(null);
    const [me, setMe] = useState(null);
    const { socket } = useSocket();
    const [deletedChatId, setDeletedChatId] = useState(null);

    // =======================socket=======================
    useEffect(() => {
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
            // console.log("chat sockett");
            // console.log(chat);
        })
        socket.on("deleteMessage", (chatId) => {
            setDeletedChatId(chatId);
        })
    }, []);

    useEffect(() => {
        if (deletedChatId) {
            // console.log("deleted chat id: ", deletedChatId);
            // edit content of deletedChatId to "The message has been recalled!"
            const newMessages = messages.map(message => {
                if (message._id === deletedChatId) {
                    return {
                        // ...message,
                        _id: message._id,
                        user: message.user,
                        text: "The message has been recalled!",
                        type: "deleted",
                        createdAt: message.createdAt,
                    }
                }
                return message;
            })
            setMessages(newMessages);
        }
    }, [deletedChatId]);

    useEffect(() => {
        if (chatReceived) {
            // console.log('chat received content:', chatReceived?.content?.images)
            const { text, video, image, file, images } = chatReceived.content;
            const { type } = chatReceived;

            const newMessage = {
                _id: chatReceived?._id || chatReceived.createdAt,
                ...(text && { text }),
                ...(image && { image }),
                ...(video && { video }),
                ...(file && { file }),
                ...(type && { type }),
                ...(images && images?.length > 0 && { images }),
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
                // console.log("chat sau khi lay api vee bang conversation id ==============================")
                const formattedMessages = chats.map(message => {
                    // console.log("chat received: ", message.content);
                    const { text, video, image, file, images } = message.content;
                    const { type } = message;

                    return {
                        _id: message._id,
                        ...(text && { text }),
                        ...(image && { image }),
                        ...(video && { video }),
                        ...(file && { file }),
                        ...(type && { type }),
                        ...(images && images?.length > 0 && { images }),
                        createdAt: new Date(message.createdAt),
                        user: {
                            _id: message.senderInfo._id,
                            name: message.senderInfo.name,
                            avatar: message.senderInfo.avatar
                        }
                    }
                });
                setMessages(formattedMessages.reverse());
            }
        })();
    }, [])


    // ========================================Xử lí thu hồi tin nhắn

    // Thu hồi phía mình
    const deleteMessage = async () => {
        try {
            // console.log("message:", selectedMessage);
            console.log("id message:", selectedMessage._id);
            const response = await axiosPrivate.post(`/chat/deleteYourSide/${selectedMessage._id}`);
            console.log("Tin nhắn đã được xóa: ", response);
            setIsConfirmModalVisible(false);
            setIsConfirmModalImageVisible(false);
            setIsConfirmModalVideoVisible(false);

            setMessages(messages.filter(message => message._id !== selectedMessage._id));

        } catch (error) {
            console.error('Lỗi khi xóa tin nhắn:', error);
        }
    }

    // Thu cả 2 bên
    const unsendMessage = async () => {
        try {
            // console.log("message:", selectedMessage);
            console.log("id message:", selectedMessage._id);
            const response = await axiosPrivate.post(`/chat/delete/${selectedMessage._id}`);
            console.log("Tin nhắn đã thu hồi: ", response);
            setModalVisible(false);
            setModalImageVisible(false);
            setModalVideoVisible(false);

        } catch (error) {
            console.error('Lỗi khi thu hồi tin nhắn:', error);
        }
    }

    // video
    const videoRef = useRef(null);
    // const [isPlaying, setIsPlaying] = useState(false);
    // const [status, setStatus] = useState({});

    // ==========================================cập nhật trạng thái phát lại của video
    const onPlaybackStatusUpdate = (status) => {
        if (!status.isLoaded) {
            // xử lý nếu cần khi video chưa load
        } else {
            // setIsPlaying(status.isPlaying);

            if (status.didJustFinish) {
                // Nếu video vừa chạy xong, đặt lại vị trí phát lại về đầu
                videoRef.current.replayAsync();
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

    // modal error when file size too large
    const toggleErrorFileSize = () => {
        setIsModalErrorFileSizeVisible(!isModalErrorFileSizeVisible);
    }

    // modal unsend message
    const toggleUnsendMessage = () => {
        setModalVisible(!isModalVisible);
    }

    // modal confirm unsend message

    const toggleConfirmUnsendMessage = () => {
        setIsConfirmModalVisible(!isConfirmModalVisible);
    }

    // modal unsend image
    const toggleUnsendImage = () => {
        setModalImageVisible(!isModalImageVisible);
    }
    // modal confirm unsend image
    const toggleConfirmUnsendImage = () => {
        setIsConfirmModalImageVisible(!isConfirmModalImageVisible);
    }

    // modal unsend video
    const toggleUnsendVideo = () => {
        setModalVideoVisible(!isModalVideoVisible);
    }
    // modal confirm unsend video
    const toggleConfirmUnsendVideo = () => {
        setIsConfirmModalVideoVisible(!isConfirmModalVideoVisible);
    }

    // xử lí gửi ảnh
    const onSendMedia = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            aspect: [0, 0],
            quality: 1,
            multiple: true,
            allowsMultipleSelection: true
        });

        console.log("ImagePicker result:", result);

        if (result.cancelled) {
            return;
        }

        if (result.assets.length > 1) {
            const formData = new FormData();
            // send multiple images
            result.assets.forEach((item, index) => {
                formData.append("files", {
                    uri: item.uri,
                    name: item.uri.split("/").pop(),
                    type: mime.getType(item.uri)
                });
            });
            if (formData) {
                axiosPrivate.post('/chat/Multifiles', formData, {
                    params: {
                        type: "images",
                        senderId: currentUser.user.uid,
                        conversationId: conversationInfo?.conversationId
                    },
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Accept: "application/json",
                    }
                }).then(res => {

                }).catch(err => {
                    setIsModalErrorFileSizeVisible(true);
                })
            }
        } else {
            // Xử lí upload media lên AWS
            let localUri = result.uri;
            let filename = localUri.split("/").pop();
            let match = /\.(\w+)$/.exec(filename);

            const formData = new FormData();

            formData.append("file", {
                uri: localUri,
                name: filename,
                type: mime.getType(localUri)
            });

            console.log('formData:');
            console.log(formData._parts[0][1]);

            if (formData) {
                axiosPrivate.post('/chat/files', formData, {
                    params: {
                        type: result.type,
                        senderId: currentUser.user.uid,
                        conversationId: conversationInfo?.conversationId
                    },
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Accept: "application/json",
                    }
                }).then(res => {

                }).catch(err => {
                    setIsModalErrorFileSizeVisible(true);
                })
            }
        }


        // Xử lí chọn media và gửi ở gifted chat
        // const selectedMedia = result.assets.map((item, index) => {
        //     const mediaType = item.type ? item.type.toLowerCase() : '';

        //     return {
        //         _id: messages.length + index + 1,
        //         type: mediaType, // Đảm bảo type là "video" khi gửi video
        //         [mediaType]: item.uri,
        //         createdAt: new Date(),
        //         user: {
        //             _id: currentUser.user.uid,
        //         },
        //     };
        // });

        // console.log("Selected media:", selectedMedia);
        // onSend(selectedMedia);

    };

    // Xu li onLongPress tin nhắn text

    const onMessageLongPress = (context, message) => {
        console.log("on long press Message: ", message);
        setSelectedMessage(message);
        setMessageLength(message.text.length);
        setModalVisible(true);
    }

    const handleImageLongPress = (context, message) => {
        console.log('Bạn đã nhấn và giữ vào hình ảnh:', message);
        setSelectedMessage(message);
        setModalImageVisible(true);
    };


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
                    <TouchableOpacity
                    onPress={() => navigation.navigate('OptionChat', { conversationInfo: conversationInfo })}
                    >
                    <AntDesign name="bars" size={28} color="white" />

                    </TouchableOpacity>
                </View>
            )

        });
    }, [navigation, searchUser]);
    // console.log("conversation: ");
    // console.log(conversation);

    // Gui tai lieu
    const pickDocument = async () => {
        try {
            const document = await DocumentPicker.getDocumentAsync();


            const formData = new FormData();
            formData.append("file", {
                uri: document.assets[0].uri,
                name: document.assets[0].name,
                type: mime.getType(document.assets[0].uri)
            });

            console.log('formData:');
            console.log(formData._parts[0][1]);

            if (formData) {
                axiosPrivate.post('/chat/files', formData, {
                    params: {
                        type: 'file',
                        senderId: currentUser.user.uid,
                        conversationId: conversationInfo?.conversationId
                    },
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Accept: "application/json",
                    }
                }).then(res => {

                }).catch(err => {
                    setIsModalErrorFileSizeVisible(true);

                })
                console.log("up file thanh cong!");
            }

            const newMessage = {
                _id: Math.random().toString(),
                name: document.assets[0].name, // ID duy nhất
                type: document.assets[0].mimeType, // Đường dẫn của tập tin được chọn
                file: document.assets[0].uri,
                size: document.assets[0].size,
                createdAt: new Date(), // Thời gian gửi tin nhắn
                user: {
                    _id: currentUser.user.uid,
                }, // Người gửi tin nhắn
            };

            // setMessages(previousMessages => GiftedChat.append(previousMessages, newMessage));
            // onSend([newMessage]);

        } catch (error) {
            console.error('Error picking document:', error);
        }
    };

    // Hàm render tin nhắn tùy chỉnh
    const renderCustomMessage = (props) => {
        const { text, image, video, file, type, images } = props.currentMessage;
        // console.log("images: ", images);
        const files = [
            'application/pdf',
            'application/msword',
        ];
        // console.log("props of custom render mesage: ", props.currentMessage);
        const isCurrentUser = props.currentMessage.user._id === currentUser.user.uid;
        const fileTypeDocument = mime.getType(file?.url);



        // Kiểm tra nếu là tin nhắn hình ảnh
        if (image || fileTypeDocument === 'image/jpeg' || fileTypeDocument === 'image/png') {
            return (
                <TouchableOpacity
                    style={{ width: 300, height: 300, marginLeft: isCurrentUser ? '30%' : '2%' }}
                    onLongPress={() => {
                        setSelectedMessage(props.currentMessage);
                        setModalImageVisible(true);
                    }}
                >
                    <Image
                        source={{ uri: image }}
                        style={{ width: '83%', height: '93%', borderRadius: 20, paddingTop: 5, paddingBottom: 5 }}
                        resizeMode="cover"
                    />
                </TouchableOpacity>
            );
        }
        // Kiểm tra tin nhắn là mảng hình ảnh
        if ((images && Array.isArray(images) && images.length > 0) || (fileTypeDocument === 'image/jpeg' || fileTypeDocument === 'image/png')) {
            let images1 = images;
            return (
                <View style={{ width: 250, height: 280, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', borderWidth: 1, marginBottom: 5, borderRadius: 10, marginLeft: isCurrentUser ? '30%' : '2%' }}>

                    {images1.map((img, index) => (
                        <TouchableOpacity
                            key={index}
                            style={{ width: 100, height: 100, margin: 5, justifyContent: 'center', alignItems: 'center' }}
                        // onLongPress={() => {
                        //     console.log('message: ', img);
                        //     setSelectedMessage(img);
                        //     setModalImageVisible(true);
                        // }}
                        >
                            <Image
                                source={{ uri: img.url }}
                                style={{ width: '95%', height: '95%', borderRadius: 10 }}
                                resizeMode="cover"
                            />
                        </TouchableOpacity>
                    ))}
                </View>
            );
        }

        // Kiểm tra nếu là tin nhắn video
        if (video || fileTypeDocument === 'video/mp4') {

            return (
                <View style={{ width: 400, height: 300, overflow: 'hidden', flexDirection: 'row' }}>

                    {props.currentMessage.user._id == currentUser.user.uid ? (
                        <View style={{ width: '96%', height: 300 }}>
                            <View style={{ width: 300, height: 300, overflow: 'hidden', flexDirection: 'row', marginLeft: '23%' }}>
                                <TouchableOpacity
                                    style={{ width: 30, height: '100%', justifyContent: "center" }}
                                    onPress={() => {
                                        console.log("selectedMessage: ", props.currentMessage);
                                        setSelectedMessage(props.currentMessage);
                                        setModalVideoVisible(true);
                                    }}
                                >
                                    <Entypo name="dots-three-horizontal" size={24} color="black" />
                                </TouchableOpacity>
                                <Video
                                    ref={videoRef}
                                    source={{ uri: video ? video : file?.url }}
                                    style={{ width: 250, height: 280, backgroundColor: '#000', borderRadius: 20, paddingTop: 5, paddingBottom: 5 }}
                                    resizeMode="cover"
                                    useNativeControls
                                    isLooping
                                />
                            </View>
                        </View>

                    ) : (
                        <View style={{ width: 300, height: 300, overflow: 'hidden', flexDirection: 'row', marginLeft: '2%' }}>

                            <Video
                                ref={videoRef}
                                source={{ uri: video ? video : file?.url }}
                                style={{ width: 250, height: 280, backgroundColor: '#000', borderRadius: 20, paddingTop: 5, paddingBottom: 5 }}
                                resizeMode="cover"
                                useNativeControls
                                isLooping
                            />
                            <TouchableOpacity
                                style={{ width: 30, height: '100%', justifyContent: "center" }}
                                onPress={() => {
                                    setSelectedMessage(props.currentMessage);
                                    setModalVideoVisible(true);
                                }}
                            >
                                <Entypo name="dots-three-horizontal" size={24} color="black" />
                            </TouchableOpacity>
                        </View>
                    )}
                    {/* <TouchableOpacity
                        style={{ width: 30, height: '100%', justifyContent: "center" }}
                        onPress={() => {
                            setSelectedMessage(props.currentMessage);
                            setModalVideoVisible(true);
                        }}
                    >
                        <Entypo name="dots-three-horizontal" size={24} color="black" />
                    </TouchableOpacity>
                    <Video
                        ref={videoRef}
                        source={{ uri: video ? video : file?.url }}
                        style={{ width: 250, height: 280, backgroundColor: '#000', borderRadius: 20, paddingTop: 5, paddingBottom: 5 }}
                        resizeMode="cover"
                        useNativeControls
                        // onPlaybackStatusUpdate={onPlaybackStatusUpdate}
                        isLooping
                    /> */}
                </View>
            );
        }


        // Kiểm tra nếu là tin nhắn document (PDF)
        if (file?.url) {
            // console.log("fileTypeDocument: ", fileTypeDocument);
            const icons = {
                'application/pdf': require('../assets/pdf-icon.png'),
                'application/msword': require('../assets/word-icon.png'),
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document": require('../assets/word-icon.png'),
                "application/vnd.ms-powerpoint": require('../assets/ppt-icon.png'),
                "application/vnd.openxmlformats-officedocument.presentationml.presentation": require('../assets/ppt-icon.png'),
                "application/vnd.rar": require('../assets/rar-icon.png'),
                "application/zip": require('../assets/rar-icon.png'),
                "text/csv": require('../assets/csv-icon.png'),
            }
            return (
                <TouchableOpacity
                    onLongPress={() => {
                        setSelectedMessage(props.currentMessage);
                        setModalVisible(true);
                    }}
                    onPress={() => Linking.openURL(file.url)}
                    style={{ width: '70%', height: 60, marginBottom: 5, marginLeft: isCurrentUser ? '27%' : '2%', backgroundColor: 'grey', borderRadius: 10, justifyContent: 'center' }}
                >
                    <View
                        style={{ width: '100%', height: '100%', flexDirection: 'row' }}
                    >
                        <View style={{ width: '30%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            <Image
                                source={icons[fileTypeDocument] || require('../assets/pdf-icon.png')}
                                style={{ width: 40, height: 40 }}
                            />
                        </View>
                        <View style={{ width: '70%', height: '100%', justifyContent: 'center' }}>
                            <Text
                                style={{ color: '#FFF', fontSize: 16, fontWeight: '500' }}
                                numberOfLines={2}
                            >
                                {file.name} File -
                                {file.size} kb
                            </Text>
                        </View>

                    </View>
                </TouchableOpacity>
            );
        }

        // Nếu không phải loại tin nhắn tùy chỉnh, sử dụng Bubble mặc định
        // console.log("type: ");
        // console.log(type);

        const bgrColor = {
            deleted: "#B9BDC1",
            notify: "#ff8fab",
        }
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        // Thêm margin cho các text bên phải
                        marginBottom: 5,
                        backgroundColor: (bgrColor[type] || '#0084FF'),
                        marginRight: 14
                    },
                    left: {
                        // Thêm margin cho các text bên trái
                        marginLeft: 8,
                        marginBottom: 5,
                        backgroundColor: (bgrColor[type] || '#fff'),
                    },
                }}
                textStyle={{
                    right: {
                        color: type === 'deleted' ? "#000" : '#fff'
                    },
                    left: {
                        color: '#000'
                    }
                }}
            />
        )
    };


    // xử lí khi gửi dữ liệu
    const onSend = async (newMessages = []) => {
        const updatedMessages = newMessages.map(message => {
            const { type, image, video, file, ...rest } = message;

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
            } else if (type === 'application/pdf') {
                return {
                    ...rest,
                    document: file,
                    type: 'document',
                };
            }

            // Xử lý các trường hợp khác (nếu có)
            return message;
        });

        console.log("updatedMessages: ", updatedMessages);

        // setMessages(previousMessages => GiftedChat.append(previousMessages, updatedMessages));

        const { text } = { ...updatedMessages[0] };

        // trường hợp chọn vào userConversation
        let conversationId = conversationInfo?.conversationId;
        if (conversationId) {
            // do nothing for now
            const chat = await axiosPrivate.post(`/chat`, {
                conversationId,
                senderId: currentUser.user.uid,
                content: {
                    ...(text && { text }),
                }
            });
            console.log("chat: ");
            console.log(chat);
        } else if (searchUser?._id) {
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

    //  gửi image

    const CustomImage = ({ imageUrl, onLongPress }) => {
        return (
            <TouchableOpacity
                onLongPress={onLongPress}
            >
                <Image
                    source={{ uri: imageUrl }}
                    style={{ width: 250, height: 300, borderRadius: 20 }}
                    resizeMode="cover"
                />
            </TouchableOpacity>
        );
    };


    // gửi video
    const renderMessageVideo = (props) => {
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
                            onPress={pickDocument}
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
        const { user, createdAt, text, image, video, messageId } = props.currentMessage;

        // // Kiểm tra nếu là tin nhắn hình ảnh
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
                            backgroundColor: 'transparent',

                        },
                        left: {
                            backgroundColor: 'transparent',
                        }
                    }}
                />
            );
        }

        if (video) {
            return (
                <View style={{ width: 280, height: 300, overflow: 'hidden', flexDirection: 'row' }}>
                    <TouchableOpacity
                        style={{ width: 30, height: '100%', justifyContent: "center" }}
                        onPress={() => {
                            setSelectedMessage(props.currentMessage);
                            setModalVideoVisible(true);
                        }}
                    >
                        <Entypo name="dots-three-horizontal" size={24} color="black" />
                    </TouchableOpacity>
                    <Video
                        ref={videoRef}
                        source={{ uri: video }}
                        style={{ width: 250, height: '100%', backgroundColor: '#000', borderRadius: 20 }}
                        resizeMode="cover"
                        useNativeControls
                        // onPlaybackStatusUpdate={onPlaybackStatusUpdate}
                        isLooping
                    />
                </View>
            );
        }
        // Nếu là tin nhắn text
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: 'red',
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
        <View style={{ width: '100%', height: '100%' }}>
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
                // renderBubble={renderBubble} // custom màu bóng chat 
                renderSend={renderSend} // custom icon gửi thay vì chữ SEND
                renderMessage={renderCustomMessage} // custom tin nhắn
                // renderMessageVideo={renderMessageVideo} // dùng để gửi video
                // renderMessageImage={(props) => (
                //     <CustomImage
                //         {...props}
                //         imageUrl={props.currentMessage.image}
                //         onLongPress={() => handleImageLongPress(props.context, props.currentMessage)}
                //     />

                // )} // dùng để gửi image
                renderUsernameOnMessage={true} // hiện tên người gửi bên dưới nội dung
                renderInputToolbar={renderInputToolBar} // custom thanh bar của tin nhắn
                // renderActions={renderAction} // chỉnh icon kế bên ô nhập tin nhắn
                onLongPress={(context, message) => onMessageLongPress(context, message)}
            />
            {/* ================================================================= Modal khi xóa tin nhắn text */}
            <Modal
                isVisible={isModalVisible}
                onBackdropPress={toggleUnsendMessage}
                style={{
                    // position:'absolute',
                    top: 180,
                    left: 20
                }}
                backdropOpacity={0.65}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                backdropTransitionInTiming={600}
                backdropTransitionOutTiming={600}
                hideModalContentWhileAnimating={true}
            >
                <View style={{ width: 325, height: messageLength + 70, marginLeft: 20, backgroundColor: '#52A0FF', borderRadius: 10, justifyContent: 'center' }}>
                    <Text style={{ fontWeight: "500", fontSize: 18, marginLeft: 5, color: "#FFF" }}>
                        {selectedMessage.text}
                    </Text>
                </View>
                {currentUser.user.uid === selectedMessage.user?._id ? (
                    <View style={{ width: 325, height: 70, borderRadius: 10, backgroundColor: '#FFF', marginLeft: 20, marginTop: 10, marginBottom: 30 }}>
                        <View style={{ width: '90%', height: '90%', marginLeft: '5%', marginTop: '2%', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                            <View style={{ width: 55, height: 60, alignItems: 'center' }}>
                                <Image
                                    source={require('../assets/reply.png')}
                                    style={{ width: 32, height: 32 }}
                                />
                                <Text>
                                    Reply
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={{ width: 55, height: 60, alignItems: 'center' }}
                                onPress={() => {
                                    navigation.navigate('ForwardMessage', { message: selectedMessage, conversationId: conversationInfo?.conversationId });
                                    setModalVisible(false);
                                }}
                            >
                                <Image
                                    source={require('../assets/arrow.png')}
                                    style={{ width: 32, height: 32 }}
                                />
                                <Text>
                                    Forward
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ width: 55, height: 60, alignItems: 'center' }}
                                onPress={unsendMessage}
                            >
                                <Image
                                    source={require('../assets/message.png')}
                                    style={{ width: 32, height: 32 }}
                                />
                                <Text>
                                    Recall
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ width: 55, height: 60, alignItems: 'center' }}
                                onPress={() => {
                                    setModalVisible(false);
                                    setIsConfirmModalVisible(true);
                                }}
                            >
                                <Image
                                    source={require('../assets/delete.png')}
                                    style={{ width: 32, height: 32 }}
                                />
                                <Text>
                                    Delete
                                </Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                ) : (
                    <View style={{ width: 325, height: 70, borderRadius: 10, backgroundColor: '#FFF', marginLeft: 20, marginTop: 10, marginBottom: 30 }}>
                        <View style={{ width: '90%', height: '90%', marginLeft: '5%', marginTop: '2%', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                            <View style={{ width: 55, height: 60, alignItems: 'center' }}>
                                <Image
                                    source={require('../assets/reply.png')}
                                    style={{ width: 32, height: 32 }}
                                />
                                <Text>
                                    Reply
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={{ width: 55, height: 60, alignItems: 'center' }}
                                onPress={() => {
                                    navigation.navigate('ForwardMessage', { message: selectedMessage, conversationId: conversationInfo?.conversationId });
                                    setModalVisible(false);
                                }}
                            >
                                <Image
                                    source={require('../assets/arrow.png')}
                                    style={{ width: 32, height: 32 }}
                                />
                                <Text>
                                    Forward
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ width: 55, height: 60, alignItems: 'center' }}
                                onPress={() => {
                                    setModalVisible(false);
                                    setIsConfirmModalVisible(true);
                                }}
                            >
                                <Image
                                    source={require('../assets/delete.png')}
                                    style={{ width: 32, height: 32 }}
                                />
                                <Text>
                                    Delete
                                </Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                )}

            </Modal>
            {/* ================================================================= Modal xác nhận khi xóa tin nhắn text */}
            <Modal
                isVisible={isConfirmModalVisible}
                onBackdropPress={toggleConfirmUnsendMessage}
                style={{
                    position: 'absolute',
                    top: 300,
                    left: 20
                }}
                backdropOpacity={0.65}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                backdropTransitionInTiming={600}
                backdropTransitionOutTiming={600}
                hideModalContentWhileAnimating={true}
            >
                <View style={{ width: 325, height: 160, borderRadius: 10, backgroundColor: '#FFF', marginLeft: 0, marginTop: 0, marginBottom: 30 }}>
                    <Text style={{ width: 260, fontSize: 20, fontWeight: "600", marginLeft: 10, marginTop: 25 }}>
                        Bạn có muốn xóa tin nhắn này?
                    </Text>
                    <Text style={{ fontSize: 16, fontWeight: "400", marginLeft: 10, marginTop: 10 }}>
                        Tin nhắn này sẽ được xóa ở phía bạn
                    </Text>
                    <View style={{ borderWidth: 0.5, width: '100%', marginTop: 10 }} />
                    <View style={{ width: '100%', height: '50%', marginTop: 10, flexDirection: 'row', justifyContent: 'space-around' }}>
                        <TouchableOpacity
                            onPress={() => { setIsConfirmModalVisible(false) }}
                        >
                            <Text style={{ fontSize: 18, fontWeight: '800' }}>
                                Hủy
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={deleteMessage}
                        >
                            <Text style={{ fontSize: 18, fontWeight: '800', color: 'red' }}>
                                Xóa
                            </Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </Modal>
            {/* ================================================================= Modal khi xóa tin nhắn hình ảnh */}
            <Modal
                isVisible={isModalImageVisible}
                onBackdropPress={toggleUnsendImage}
                style={{
                    position: 'absolute',
                    top: 250,
                    left: 35
                }}
                backdropOpacity={0.65}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                backdropTransitionInTiming={600}
                backdropTransitionOutTiming={600}
                hideModalContentWhileAnimating={true}
            >

                <View style={{ width: 250, height: 300, marginLeft: 70 }}>
                    <Image
                        source={{ uri: selectedMessage.image ? selectedMessage.image : selectedMessage.url }}
                        style={{ width: '100%', height: '100%', borderRadius: 20 }}
                    />
                </View>
                {currentUser.user.uid === selectedMessage.user?._id ? (
                    <View style={{ width: 325, height: 70, borderRadius: 10, backgroundColor: '#FFF', marginLeft: 0, marginTop: 10, marginBottom: 30 }}>
                        <View style={{ width: '90%', height: '90%', marginLeft: '5%', marginTop: '2%', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                            <View style={{ width: 55, height: 60, alignItems: 'center' }}>
                                <Image
                                    source={require('../assets/reply.png')}
                                    style={{ width: 32, height: 32 }}
                                />
                                <Text>
                                    Reply
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={{ width: 55, height: 60, alignItems: 'center' }}
                                onPress={() => {
                                    navigation.navigate('ForwardMessage', { message: selectedMessage, conversationId: conversationInfo?.conversationId });
                                    setModalImageVisible(false);
                                }}
                            >
                                <Image
                                    source={require('../assets/arrow.png')}
                                    style={{ width: 32, height: 32 }}
                                />
                                <Text>
                                    Forward
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ width: 55, height: 60, alignItems: 'center' }}
                                onPress={unsendMessage}
                            >
                                <Image
                                    source={require('../assets/message.png')}
                                    style={{ width: 32, height: 32 }}
                                />
                                <Text>
                                    Recall
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ width: 55, height: 60, alignItems: 'center' }}
                                onPress={() => {
                                    setModalVideoVisible(false);
                                    setIsConfirmModalVideoVisible(true);
                                }}
                            >
                                <Image
                                    source={require('../assets/delete.png')}
                                    style={{ width: 32, height: 32 }}
                                />
                                <Text>
                                    Delete
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <View style={{ width: 325, height: 70, borderRadius: 10, backgroundColor: '#FFF', marginLeft: 0, marginTop: 10, marginBottom: 30 }}>
                        <View style={{ width: '90%', height: '90%', marginLeft: '5%', marginTop: '2%', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                            <View style={{ width: 55, height: 60, alignItems: 'center' }}>
                                <Image
                                    source={require('../assets/reply.png')}
                                    style={{ width: 32, height: 32 }}
                                />
                                <Text>
                                    Reply
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={{ width: 55, height: 60, alignItems: 'center' }}
                                onPress={() => {
                                    navigation.navigate('ForwardMessage', { message: selectedMessage, conversationId: conversationInfo?.conversationId });
                                    setModalImageVisible(false);
                                }}
                            >
                                <Image
                                    source={require('../assets/arrow.png')}
                                    style={{ width: 32, height: 32 }}
                                />
                                <Text>
                                    Forward
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ width: 55, height: 60, alignItems: 'center' }}
                                onPress={() => {
                                    setModalVideoVisible(false);
                                    setIsConfirmModalVideoVisible(true);
                                }}
                            >
                                <Image
                                    source={require('../assets/delete.png')}
                                    style={{ width: 32, height: 32 }}
                                />
                                <Text>
                                    Delete
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

            </Modal>
            {/* ================================================================= Modal xác nhận khi xóa tin nhắn hình ảnh */}
            <Modal
                isVisible={isConfirmModalImageVisible}
                onBackdropPress={toggleConfirmUnsendImage}
                style={{
                    position: 'absolute',
                    top: 300,
                    left: 20
                }}
                backdropOpacity={0.65}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                backdropTransitionInTiming={600}
                backdropTransitionOutTiming={600}
                hideModalContentWhileAnimating={true}
            >
                <View style={{ width: 325, height: 160, borderRadius: 10, backgroundColor: '#FFF', marginLeft: 0, marginTop: 0, marginBottom: 30 }}>
                    <Text style={{ width: 260, fontSize: 20, fontWeight: "600", marginLeft: 10, marginTop: 25 }}>
                        Bạn có muốn xóa hình ảnh này?
                    </Text>
                    <Text style={{ fontSize: 16, fontWeight: "400", marginLeft: 10, marginTop: 10 }}>
                        Hình ảnh này sẽ được xóa ở phía bạn
                    </Text>
                    <View style={{ borderWidth: 0.5, width: '100%', marginTop: 10 }} />
                    <View style={{ width: '100%', height: '50%', marginTop: 10, flexDirection: 'row', justifyContent: 'space-around' }}>
                        <TouchableOpacity
                            onPress={() => { setIsConfirmModalImageVisible(false) }}
                        >
                            <Text style={{ fontSize: 18, fontWeight: '800' }}>
                                Hủy
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={deleteMessage}
                        >
                            <Text style={{ fontSize: 18, fontWeight: '800', color: 'red' }}>
                                Xóa
                            </Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </Modal>
            {/* ================================================================= Modal khi xóa tin nhắn video */}
            <Modal
                isVisible={isModalVideoVisible}
                onBackdropPress={toggleUnsendVideo}
                style={{
                    position: 'absolute',
                    top: 250,
                    left: 35
                }}
                backdropOpacity={0.65}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                backdropTransitionInTiming={600}
                backdropTransitionOutTiming={600}
                hideModalContentWhileAnimating={true}
            >
                <View style={{ width: 250, height: 300, marginLeft: 50 }}>
                    <Video
                        source={{
                            uri: selectedMessage.file?.url ? selectedMessage.file?.url : selectedMessage.video
                        }}
                        style={{ width: '100%', height: '100%', borderRadius: 20 }}
                        resizeMode="cover"
                    />
                </View>
                {currentUser.user.uid === selectedMessage.user?._id ? (
                    <View style={{ width: 325, height: 70, borderRadius: 10, backgroundColor: '#FFF', marginLeft: 0, marginTop: 10, marginBottom: 30 }}>
                        <View style={{ width: '90%', height: '90%', marginLeft: '5%', marginTop: '2%', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                            <View style={{ width: 55, height: 60, alignItems: 'center' }}>
                                <Image
                                    source={require('../assets/reply.png')}
                                    style={{ width: 32, height: 32 }}
                                />
                                <Text>
                                    Reply
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={{ width: 55, height: 60, alignItems: 'center' }}
                                onPress={() => {
                                    navigation.navigate('ForwardMessage', { message: selectedMessage, conversationId: conversationInfo?.conversationId });
                                    setModalVideoVisible(false);
                                }}
                            >
                                <Image
                                    source={require('../assets/arrow.png')}
                                    style={{ width: 32, height: 32 }}
                                />
                                <Text>
                                    Forward
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ width: 55, height: 60, alignItems: 'center' }}
                                onPress={unsendMessage}
                            >
                                <Image
                                    source={require('../assets/message.png')}
                                    style={{ width: 32, height: 32 }}
                                />
                                <Text>
                                    Recall
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ width: 55, height: 60, alignItems: 'center' }}
                                onPress={() => {
                                    setModalVideoVisible(false);
                                    setIsConfirmModalVideoVisible(true);
                                }}
                            >
                                <Image
                                    source={require('../assets/delete.png')}
                                    style={{ width: 32, height: 32 }}
                                />
                                <Text>
                                    Delete
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) :
                    (
                        <View style={{ width: 325, height: 70, borderRadius: 10, backgroundColor: '#FFF', marginLeft: 0, marginTop: 10, marginBottom: 30 }}>
                            <View style={{ width: '90%', height: '90%', marginLeft: '5%', marginTop: '2%', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                                <View style={{ width: 55, height: 60, alignItems: 'center' }}>
                                    <Image
                                        source={require('../assets/reply.png')}
                                        style={{ width: 32, height: 32 }}
                                    />
                                    <Text>
                                        Reply
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    style={{ width: 55, height: 60, alignItems: 'center' }}
                                    onPress={() => {
                                        navigation.navigate('ForwardMessage', { message: selectedMessage, conversationId: conversationInfo?.conversationId });
                                        setModalVideoVisible(false);
                                    }}
                                >
                                    <Image
                                        source={require('../assets/arrow.png')}
                                        style={{ width: 32, height: 32 }}
                                    />
                                    <Text>
                                        Forward
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ width: 55, height: 60, alignItems: 'center' }}
                                    onPress={() => {
                                        setModalVideoVisible(false);
                                        setIsConfirmModalVideoVisible(true);
                                    }}
                                >
                                    <Image
                                        source={require('../assets/delete.png')}
                                        style={{ width: 32, height: 32 }}
                                    />
                                    <Text>
                                        Delete
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

            </Modal>
            {/* ================================================================= Modal xác nhận khi xóa tin nhắn video */}
            <Modal
                isVisible={isConfirmModalVideoVisible}
                onBackdropPress={toggleConfirmUnsendVideo}
                style={{
                    position: 'absolute',
                    top: 300,
                    left: 20
                }}
                backdropOpacity={0.65}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                backdropTransitionInTiming={600}
                backdropTransitionOutTiming={600}
                hideModalContentWhileAnimating={true}
            >
                <View style={{ width: 325, height: 160, borderRadius: 10, backgroundColor: '#FFF', marginLeft: 0, marginTop: 0, marginBottom: 30 }}>
                    <Text style={{ width: 260, fontSize: 20, fontWeight: "600", marginLeft: 10, marginTop: 25 }}>
                        Bạn có muốn xóa video này?
                    </Text>
                    <Text style={{ fontSize: 16, fontWeight: "400", marginLeft: 10, marginTop: 10 }}>
                        Video này sẽ được xóa ở phía bạn
                    </Text>
                    <View style={{ borderWidth: 0.5, width: '100%', marginTop: 10 }} />
                    <View style={{ width: '100%', height: '50%', marginTop: 10, flexDirection: 'row', justifyContent: 'space-around' }}>
                        <TouchableOpacity
                            onPress={() => { setIsConfirmModalVideoVisible(false) }}
                        >
                            <Text style={{ fontSize: 18, fontWeight: '800' }}>
                                Hủy
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={deleteMessage}
                        >
                            <Text style={{ fontSize: 18, fontWeight: '800', color: 'red' }}>
                                Xóa
                            </Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </Modal>
            {/* ================================================================= Modal khi gửi file quá lớn */}
            <Modal
                isVisible={isModalErrorFileSizeVisible}
                onBackdropPress={toggleErrorFileSize}
                style={{
                    // position:'absolute',
                    top: 180,
                    left: 20
                }}
                backdropOpacity={0.65}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                backdropTransitionInTiming={600}
                backdropTransitionOutTiming={600}
                hideModalContentWhileAnimating={true}
            >
                <View style={{ width: 300, height: 100, backgroundColor: 'white', justifyContent: 'center' }}>
                    <Text
                        style={{ fontSize: 20, fontWeight: '600', marginLeft: 10, color: 'red' }}
                    >
                        File lớn hơn 20MB, vui lòng chọn file khác!
                    </Text>
                </View>
            </Modal>
        </View>

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
    },
});