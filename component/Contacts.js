import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
const Tab = createMaterialTopTabNavigator();
import {REACT_APP_API_URL} from "@env"
function BanBe({ route }) {
    console.log(REACT_APP_API_URL)
    return (
        <View style={styles.container}>
            <Text>Ban be</Text>
        </View>
    );
}
function DanhBaMay({ route }) {
    return (
        <View style={styles.container}>
            <Text>DanhBaMay</Text>
        </View>
    );
}
export default function Contact() {
    return (
        <Tab.Navigator
        // tabBarOptions={{
        // //   scrollEnabled: true,
        //   activeTintColor: "black",
        // //   indicatorStyle: { backgroundColor: "#FFCC33" },
        // }}
        screenOptions={{
          tabBarLabelStyle: { fontSize: 13, fontWeight: "bold" },
          tabBarItemStyle: { width: 130 },
        //   tabBarStyle: { backgroundColor: "#111111" },
        }}
      >
        <Tab.Screen
          name="Bạn bè"
        //   initialParams={{ account: route.params?.account }}
          component={BanBe}
        />
        <Tab.Screen
          name="Danh bạ máy"
        //   initialParams={{ account: route.params?.account }}
          component={DanhBaMay}
        />
       
      </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
    },
});