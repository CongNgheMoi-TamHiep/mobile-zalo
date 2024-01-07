import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import Login from "./component/Login";
import Home from "./component/Home";
import Signup from "./component/Signup";
import MyTabs from "./component/BottomTab";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" translucent={true} backgroundColor="transparent" />

      <Stack.Navigator initialRouteName="MyTabs">
      <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: true, title: "Đăng nhập",headerStyle: {
            backgroundColor: '#00aaff',
          },
           }}
        />
         <Stack.Screen
          name="Signup"
          component={Signup}
          options={{ headerShown: true, title: "Tạo tài khoản",headerStyle: {
            backgroundColor: '#00aaff',
          },
           }}
        />
        <Stack.Screen
          name="MyTabs"
          component={MyTabs}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
