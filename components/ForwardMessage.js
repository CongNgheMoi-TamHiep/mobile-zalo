import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, FlatList } from "react-native";
import { Ionicons, AntDesign } from '@expo/vector-icons';
import CheckBox from 'react-native-check-box'
import axiosPrivate from "../api/axiosPrivate";
import { useCurrentUser } from "../App";

export default function ForwardMessage({ route, navigation }) {

    const currentUser = useCurrentUser();

    const [isSelected, setSelection] = useState(false);

    useEffect(() => {
        (async () => {
           const response = await axiosPrivate.get(`/friends/${currentUser.user.uuid}`);
           console.log('Danh sach ban be cua user: ',response);
        })();
    }, []);

    const renderFriends = ({ item }) => {
        return (
            <View style={{ width: '100%', height: '100%', flexDirection: 'row' }}>
                <TouchableOpacity
                    style={{
                        width: '15%', height: 50, alignItems: 'center', justifyContent: 'center'
                    }}
                    onPress={() => setSelection(!isSelected)}
                >
                    <CheckBox
                        value={isSelected}
                        isChecked={isSelected}
                        onClick={() => setSelection(!isSelected)}
                    />
                </TouchableOpacity>
                <View style={{ width: '15%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
                    <Image
                        source={require('../assets/AVT_Default.jpg')}
                        style={{ width: 50, height: 50, borderRadius: 50 }}
                    />
                </View>
                <View style={{ width: '70%', height: 50, justifyContent: 'center' }}>
                    <Text
                        style={{ fontSize: 14, fontWeight: '500', width: '100%', marginLeft: 10 }}
                    >
                        Khanh
                    </Text>
                </View>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={{ width: '100%', height: 50, flexDirection: 'row', borderBottomWidth: 0.5 }}>
                <View style={{ width: '15%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <Ionicons name="arrow-back" size={30} color="black" />
                </View>
                <View style={{ width: '85%', height: '100%', justifyContent: 'center' }}>
                    <Text
                        style={{ fontSize: 20, fontWeight: '800' }}
                    >
                        Chia sẻ
                    </Text>
                    <Text
                        style={{ fontSize: 15, color: 'gray' }}
                    >
                        Chọn: 0
                    </Text>
                </View>
            </View>
            <View style={{ width: '100%', height: 150, backgroundColor: 'white' }}>
                <View style={{ width: '100%', height: 30 }}>
                    <View style={{ width: '95%', height: 30, backgroundColor: '#F7F7F7', marginLeft: '2.5%', marginTop: 10, borderRadius: 10, flexDirection: 'row' }}>
                        <View style={{ width: '15%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            <AntDesign name="search1" size={20} color="black" />
                        </View>
                        <View style={{ width: '85%', height: '100%' }}>
                            <TextInput
                                placeholder="Tìm kiếm"
                            />
                        </View>
                    </View>
                </View>
                <View style={{ width: '90%', height: 25, marginLeft: '5%', marginTop: 20, justifyContent: 'center' }}>
                    <Text
                        style={{ fontSize: 15, fontWeight: '500' }}
                    >
                        Chia sẽ đến
                    </Text>
                </View>
                <View style={{ width: '100%', height: 80, justifyContent: 'center', alignItems: 'center' }}>
                    {/* <View style={{ width: '60%', height: '100%' }}>

                    </View> */}
                </View>
            </View>
            <View style={{ width: '100%', height: 300, backgroundColor: 'white', marginTop: 15 }}>
                <View style={{ width: '95%', height: '10%', marginLeft: '2.5%', justifyContent: 'center' }}>
                    <Text
                        style={{ fontSize: 15, fontWeight: '500' }}
                    >
                        Bạn bè
                    </Text>
                </View>
                <View style={{ width: '100%', height: '90%' }}>
                    <FlatList
                        data={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
                        renderItem={renderFriends}
                        keyExtractor={item => item}
                    />
                </View>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F7F7'
        // justifyContent: "center",
        // alignItems: "center",
    },
});