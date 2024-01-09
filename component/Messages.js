import React from "react";
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity } from "react-native";

//  dữ liệu dùng để test
const data = [
    {
        id: 1,
        username: "Nguyen Tuan Hiep",
        image: 'https://1.bp.blogspot.com/-kL3SubeHWUc/VD_xwbbpKkI/AAAAAAAAQFs/eh8c2lFdsjc/s1600/Anime-image-anime-36250619-1024-768.jpg',
        time: "21 minutes",
        latestMessage: "alo alo",
        conversationId: 1,  // ID của cuộc trò chuyện
        messages: [
            { _id: 1, text: 'Hello!', createdAt: new Date(), user: { _id: 2 } },
            { _id: 2, text: 'Hi there!', createdAt: new Date(), user: { _id: 1 } }
            // Thêm tin nhắn khác nếu cần
        ]
    },
    {
        id: 2,
        username: "Nguyen Van Long",
        image: 'https://i.pinimg.com/474x/d6/7a/14/d67a14cdca5e920039d2a8acc6de3892.jpg',
        time: "1 hours",
        latestMessage: "anh yeu em",
        conversationId: 2,
        messages: [
            { _id: 3, text: 'Hi!', createdAt: new Date(), user: { _id: 1 } },
            { _id: 4, text: 'Em cũng yêu anh!', createdAt: new Date(), user: { _id: 2 } }
            // Thêm tin nhắn khác nếu cần
        ]
    }
];

export default function Chat({ navigation }) {
    // render lên màn hình các đoạn chat của user
    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.viewOfFlatlist}
            // onPress={() => navigation.navigate("Conversations", {
            //     userId: 1,  // ID của người dùng hiện tại (hoặc có thể đăng nhập)
            //     username: item.username,
            //     image: item.image,
            //     conversationId: item.conversationId,
            //     messages: item.messages
            // })}
            onPress={() => {
                navigation.navigate("Conversations", {
                    conversationData: item, // Chuyển toàn bộ thông tin cuộc trò chuyện
                });
            }}
        >
            <View style={{ width: '20%', height: 70, alignItems: 'center' }}>
                <Image
                    source={{ uri: item.image }}
                    style={{ width: 60, height: 60, borderRadius: 50 }}
                />
            </View>
            <View style={{ width: '55%', height: '100%', backgroundColor: '#fff' }}>
                <Text
                    style={{
                        fontSize: 18, fontWeight: '800', color: 'black'
                    }}
                >{item.username}</Text>
                <Text style={{ fontSize: 16, color: 'grey' }}>{item.latestMessage}</Text>
            </View>
            <View style={{ width: '25%', height: '100%', backgroundColor: '#fff', alignItems: 'center', marginTop: 5 }}>
                <Text style={{ color: 'grey', fontSize: 14 }}>{item.time}</Text>
            </View>
        </TouchableOpacity>
    )


    return (
        <View style={styles.container}>
            <View style={{ width: '100%' }}>
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                />
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
    },
    viewOfFlatlist: {
        width: '100%',
        height: 60,
        flexDirection: 'row',
        marginTop: 8,
        backgroundColor: '#fff',
        justifyContent: 'center'
    }
});