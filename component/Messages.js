import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity } from "react-native";
import axiosPrivate from "../api/axiosPrivate";
import { auth } from '../config/firebase';


export default function Chat({ navigation }) {
    //  danh sách các cuộc  hội thoại
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const userId = auth.currentUser.uid
                const userConversations = await axiosPrivate(`/userConversations/${userId}`);
                console.log("user conversation")
                console.log(userConversations.conversations)
                console.log("data =================================")
                console.log(data)
                setData(userConversations.conversations);
            } catch (error) {
                console.error('Error fetching user conversations:', error);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) {
        // Hiển thị loading indicator hoặc bất kỳ nội dung đang chờ nào bạn muốn
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (data.length === 0) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Chưa có cuộc hội thoại</Text>
            </View>
        );
    }
    // render lên màn hình các đoạn chat của user
    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.viewOfFlatlist}
            onPress={() => {
                navigation.navigate('Conversations', { conversationInfo: item })
            }}
        >
            <View style={{ width: '20%', height: 70, alignItems: 'center' }}>
                <Image
                    source={{ uri: item.avatar }}
                    style={{ width: 60, height: 60, borderRadius: 50 }}
                />
            </View>
            <View style={{ width: '55%', height: '100%', backgroundColor: '#fff' }}>
                <Text
                    style={{
                        fontSize: 18, fontWeight: '800', color: 'black'
                    }}
                >{item.userName}</Text>
                <Text style={{ fontSize: 16, color: 'grey' }}>{item.lassMess.content.text}</Text>
            </View>
            <View style={{ width: '25%', height: '100%', backgroundColor: '#fff', alignItems: 'center', marginTop: 5 }}>
                <Text style={{ color: 'grey', fontSize: 14 }}>20:20</Text>
            </View>
        </TouchableOpacity>
    )


    return (
        <View style={styles.container}>
            <View style={{ width: '100%' }}>
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={item => item.conversationId}
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