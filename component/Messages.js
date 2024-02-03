import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity } from "react-native";
import axiosPrivate from "../api/axiosPrivate";
import {auth} from '../config/firebase';


export default function Chat({ navigation }) {
    //  danh sách các cuộc  hội thoại
    const [data, setData] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const userId = auth.currentUser.uid
                const userConversations = await axiosPrivate(`/userConversations/${userId}`);
                setData(userConversations.conversations);
            } catch (error) {
                console.error('Error fetching user conversations:', error);
            }
        })();
    }, []);

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