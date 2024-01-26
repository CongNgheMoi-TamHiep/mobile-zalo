import React from "react";
import { StyleSheet, Text, View,Button } from "react-native";
import { getAuth, signOut } from 'firebase/auth';

// ...

const auth = getAuth();

export default function User() {
    return (
        <View style={styles.container}>
            <Text>User screens</Text>
            <Button title=" đăng xuất tạm" onPress={() => signOut(auth)} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
    },
});