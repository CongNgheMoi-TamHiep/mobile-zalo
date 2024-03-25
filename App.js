import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import React, { useState, createContext, useContext, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";

import Login from "./components/Login";
import Home from "./components/Home";
import Signup from "./components/Signup";
import SignupSDT from "./components/SignupSDT";
import MyTabs from "./components/BottomTab";
import Conversations from "./components/Conversations";
import Contact from "./components/Contacts";
import SignupAuth from "./components/SignupAuth";
import TestDK from "./components/TestDK";
import Search from "./components/Search";
import AddInfoUser from "./components/AddInfoUser";
const Stack = createNativeStackNavigator();
const AuthenticatedUserContext = createContext({});
import { getAuth } from "firebase/auth";
import SocketProvider from "./context/SocketProvider";

// ...

const auth = getAuth();

const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  return (
    <AuthenticatedUserContext.Provider value={{ user, setUser }}>
      <SocketProvider>
        {children}
      </SocketProvider>
    </AuthenticatedUserContext.Provider>
  );
};

function ChatStack() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Navigator>
      <Stack.Screen
        name="AddInfoUser"
        component={AddInfoUser}
        options={{ headerShown: false }}
      />
        <Stack.Screen
          name="MyTabs"
          component={MyTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Search"
          component={Search}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TestDK"
          component={TestDK}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Conversations"
          component={Conversations}
          options={{ headerShown: true }}
        />
      </Stack.Navigator>
    </SafeAreaView>
  );
}

function AuthStack() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Navigator>
       
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        {/* <Stack.Screen
          name="MyTabs"
          component={MyTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Conversations"
          component={Conversations}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Search"
          component={Search}
          options={{ headerShown: false }}
        /> */}
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
    </SafeAreaView>
  );
}

function RootNavigator() {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // onAuthStateChanged returns an unsubscriber
    const unsubscribeAuth = onAuthStateChanged(
      auth,
      async (authenticatedUser) => {
        authenticatedUser ? setUser(authenticatedUser) : setUser(null);
        setIsLoading(false);
      }
    );
    // unsubscribe auth listener on unmount
    return unsubscribeAuth;
  }, [user]);
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <ChatStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  // useEffect(() => {
  //   (async () => {
  //     await signOut(auth);
  //     console.log(auth.currentUser);
  //   })();
  // }, [])
  return (
    <AuthenticatedUserProvider>
      <RootNavigator />
    </AuthenticatedUserProvider>
  );
}
export { AuthenticatedUserContext };
export const useCurrentUser = () => useContext(AuthenticatedUserContext);