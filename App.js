import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View,ActivityIndicator  } from "react-native";
import React, { useState, createContext, useContext, useEffect } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { onAuthStateChanged } from 'firebase/auth';

import Login from "./component/Login";
import Home from "./component/Home";
import Signup from "./component/Signup";
import SignupSDT from "./component/SignupSDT";
import MyTabs from "./component/BottomTab";
import Conversations from "./component/Conversations";

const Stack = createNativeStackNavigator();
import SignupAuth from "./component/SignupAuth";
import TestDK from "./component/TestDK";

const Stack = createNativeStackNavigator();
const AuthenticatedUserContext = createContext({});
import { getAuth } from 'firebase/auth';

// ...

const auth = getAuth();

const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
return (
    <AuthenticatedUserContext.Provider value={{ user, setUser }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};

function ChatStack() {
  return (
    <Stack.Navigator defaultScreenOptions={MyTabs}>
      <Stack.Screen
          name="MyTabs"
          component={MyTabs}
          options={{ headerShown: false }}
        />
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator >
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
          name="LoginAuth"
          component={LoginAuth}
          options={{
            headerShown: true,
            title: "Nhập mã xác thực",
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
  );
}

function RootNavigator() {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);
useEffect(() => {
    // onAuthStateChanged returns an unsubscriber
    const unsubscribeAuth = onAuthStateChanged(
      auth,
      async authenticatedUser => {
        authenticatedUser ? setUser(authenticatedUser) : setUser(null);
        setIsLoading(false);
      }
    );
// unsubscribe auth listener on unmount
    return unsubscribeAuth;
  }, [user]);
if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' />
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
  return (
    <AuthenticatedUserProvider>
      <RootNavigator />
    </AuthenticatedUserProvider>
  );
}



