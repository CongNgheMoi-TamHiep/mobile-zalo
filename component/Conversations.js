import React, { useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { GiftedChat, Send, Bubble } from "react-native-gifted-chat";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

export default function Conversations({ route, navigation }) {

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

    // xử lí khi gửi dữ liệu
    const onSend = (newMessages = []) => {
        setMessages(GiftedChat.append(messages, newMessages));
    };

    // chỉnh icon gửi tin nhắn
    const renderSend = (props) => {
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
        const { user, createdAt, text } = props.currentMessage;
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#2e64e5'
                    }
                }}
                textStyle={{
                    right: {
                        color: '#fff'
                    }
                }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image
                        source={{ uri: user.avatar }}
                        style={{ width: 32, height: 32, borderRadius: 16, marginRight: 8 }}
                    />
                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
                        {user.name}
                    </Text>
                    <Text style={{ color: '#fff', marginLeft: 8 }}>
                        {new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </View>
                <Text style={{ color: '#fff', marginTop: 4 }}>{text}</Text>
            </Bubble>
        );
    };

    // Giao diện
    return (
        <GiftedChat
            messages={messages}
            // showAvatarForEveryMessage={true}
            onSend={newMessages => onSend(newMessages)}
            placeholder="Messages"
            user={{
                _id: 2,
            }}
            renderBubble={renderBubble} // hiện tại thì chưa thấy tác dụng :))
            // alwaysShowSend
            renderSend={renderSend} // custom icon gửi thay vì chữ SEND
            renderUsernameOnMessage={true} // hiện tên người gửi bên dưới nội dung
        />
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center'
    }
});