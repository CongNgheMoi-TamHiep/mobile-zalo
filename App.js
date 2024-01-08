import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import Login from "./component/Login";
import Home from "./component/Home";
import Signup from "./component/Signup";
import SignupSDT from "./component/SignupSDT";
const Stack = createNativeStackNavigator();
import SignupAuth from "./component/SignupAuth";
import TestDK from "./component/TestDK";
export default function App() {
  return (
    <NavigationContainer>
      <StatusBar
        style="auto"
        translucent={true}
        backgroundColor="transparent"
      />

      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: true,
            title: "Đăng nhập",
            headerStyle: {
              backgroundColor: "#00aaff",
            },
          }}
        />
        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{
            headerShown: true,
            title: "Tạo tài khoản",
            headerStyle: {
              backgroundColor: "#00aaff",
            },
          }}
        />
        <Stack.Screen
          name="SignupSDT"
          component={SignupSDT}
          options={{
            headerShown: true,
            title: "Tạo tài khoản",
            headerStyle: {
              backgroundColor: "#00aaff",
            },
          }}
        />
          <Stack.Screen
          name="SignupAuth"
          component={SignupAuth}
          options={{
            headerShown: true,
            title: "Nhập mã xác thực",
            headerStyle: {
              backgroundColor: "#00aaff",
            },
          }}
        />
        <Stack.Screen
          name="TestDK"
          component={TestDK}
          options={{
            headerShown: true,
            title: "test",
            headerStyle: {
              backgroundColor: "#00aaff",
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
