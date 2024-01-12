import React, { useState, useLayoutEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { GiftedChat, Send, Bubble } from "react-native-gifted-chat";
import { InputToolbar } from "react-native-gifted-chat";
import * as ImagePicker from 'expo-image-picker';
import { Video, Audio } from 'expo-av';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { AntDesign, SimpleLineIcons, Ionicons, MaterialIcons, Entypo, Octicons } from '@expo/vector-icons';

export default function Conversations({ route, navigation }) {

    // kiểm tra xem người  dùng có nhập chữ hay không
    const [isTyping, setIsTyping] = useState(false);
    // hiệu ứng dấu nháy trong phần tin nhắn
    const [isFocused, setIsFocused] = useState(false);

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
            aspect: [1, 1],
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
    const [messages, setMessages] = useState([
        {
            _id: 1,
            text: 'Chào bạn!',
            createdAt: new Date(),
            user: {
                _id: 2,
                name: 'An',
            },
        },
        {
            _id: 2,
            text: 'Chào bạn! Mình rất vui được gặp bạn.',
            createdAt: new Date(),
            user: {
                _id: 1,
                name: 'Hiệp',
            },
        },
    ]);


    // custom header
    useLayoutEffect(() => {
        const originalTitle = "Nguyen Tuan Hiep"; // Sau này đổi thành tên của người trong cùng cuộc hội thoại
        const maxTitleLength = 20; // Số ký tự tối đa bạn muốn hiển thị trước khi cắt
        // Tạo chuỗi tiêu đề được hiển thị (đảm bảo không vượt quá maxTitleLength)
        const displayedTitle = originalTitle.length > maxTitleLength
            ? `${originalTitle.slice(0, maxTitleLength - 3)}...`
            : originalTitle;


        navigation.setOptions({
            title: "", // Đổi tiêu đề
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
                            textOverflow: 'ellipsis', // Hiển thị dấu ba chấm khi vượt quá chiều rộng
                        }}
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
    }, [navigation]);


    // xử lí khi gửi dữ liệu
    const onSend = (newMessages = []) => {
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

        setMessages(GiftedChat.append(messages, updatedMessages));
    };

    // gửi video
    const renderMessageVideo = (props) => {
        console.log("videoprop:", props.currentMessage.video);
        return <View style={{ position: 'relative', height: 280, width: 250 }}>

            < Video
                style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    height: 300,
                    width: 250,
                    borderRadius: 20,
                }}
                shouldPlay={true}
                rate={1.0}
                resizeMode="cover"
                height={400}
                width={250}
                muted={true}
                source={{ uri: props.currentMessage.video }}
                allowsExternalPlayback={false}
            />
        </View>
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

    // cái này dùng để custom bóng chat nhưng mà chưa áp dụng được (có áp dụng nhưng chưa thấy tác dụng!)

    const renderBubble = (props) => {
        const { user, createdAt, text, image, video } = props.currentMessage;

        // Kiểm tra nếu là tin nhắn hình ảnh
        if (image) {
            return (
                <Bubble
                    {...props}
                    imageStyle={{
                        width: 200,
                        height: 200,
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

        if (video) {
            return (
                <Bubble
                    {...props}
                    videoStyle={{
                        width: 200,
                        height: 200,
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
                        backgroundColor: '#0084FF'
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
            placeholder="Messages"
            user={{
                _id: 2,
            }}
            renderBubble={renderBubble} // hiện tại thì chưa thấy tác dụng :))
            renderSend={renderSend} // custom icon gửi thay vì chữ SEND
            renderMessageVideo={renderMessageVideo} // dùng để gửi video
            renderUsernameOnMessage={true} // hiện tên người gửi bên dưới nội dung
            timeTextStyle={{ left: { color: '#95999A' }, right: { color: '#F0F0F0' } }} // Màu của thời gian
            renderInputToolbar={renderInputToolBar}
            renderActions={renderAction}
            onInputTextChanged={onInputTextChanged}
            onFocus={onFocus}
            onBlur={onBlur}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center'
    },
});