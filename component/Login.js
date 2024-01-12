import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { firebaseConfig } from "../config/firebase.js";
import firebase from "firebase/compat/app";
export default function App({navigation}) {
  const [sdt, setsdt] = useState("");
  const [password, setPassword] = useState("");
  const [isFocusedSdt, setIsFocusedSdt] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);
  const [isSecureEntry, setIsSecureEntry] = useState(true);
  const [isFieldsFilled, setIsFieldsFilled] = useState(false);
   const [errorMessage, setErrorMessage] = useState('');
  useEffect(() => {
    setIsFieldsFilled(sdt !== "" && password !== "");
  }, [sdt, password]);
  function Login() {
    firebase
      .auth()
      .signInWithEmailAndPassword(`${sdt}@gmail.com`, password)
      .then((userCredential) => {
        setErrorMessage('');
        navigation.navigate("MyTabs");
      })
      .catch((error) => {
       setErrorMessage('Tài khoản hoặc mật khẩu không đúng');
      });
  }
  return (
    <View style={styles.container}>
      <View style={styles.ViewTop}>
        <Text>Vui lòng nhập số điện thoại và mật khẩu để đăng nhập</Text>
      </View>
      <View style={styles.ViewInput}>
        <TextInput
          style={[
            styles.input,
            { borderBottomColor: isFocusedSdt ? "blue" : "gray" },
          ]}
          placeholder="Số điện thoại"
          autoCapitalize="none"
          keyboardType="phone-pad"
          autoFocus={true}
          value={sdt}
          onFocus={() => setIsFocusedSdt(true)}
          onBlur={() => setIsFocusedSdt(false)}
          onChangeText={(text) => setsdt(text)}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "90%",
            borderBottomWidth: 1,
            borderBottomColor: isFocusedPassword ? "blue" : "gray",
          }}
        >
          <TextInput
            style={[styles.inputPass, { width: "85%" }]}
            placeholder="Mật khẩu"
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={isSecureEntry}
            textContentType="password"
            value={password}
            onFocus={() => setIsFocusedPassword(true)}
            onBlur={() => setIsFocusedPassword(false)}
            onChangeText={(text) => setPassword(text)}
          />
          <TouchableOpacity
            onPress={() => {
              setIsSecureEntry(!isSecureEntry);
            }}
          >
            <MaterialIcons
              name={isSecureEntry ? "visibility-off" : "visibility"}
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={{fontSize:18,color:'red',marginTop:35,marginLeft:17}}>
        {errorMessage}
      </Text>
      <TouchableOpacity style={styles.button}>
        <Text
          style={{
            fontWeight: "bold",
            color: "#006AF5",
            fontSize: 18,
            paddingLeft: 17,
            marginTop: 18,
          }}
        >
          {" "}
          Lấy lại mật khẩu
        </Text>
      </TouchableOpacity>
      <View style={styles.ViewBottom}>
        <TouchableOpacity style={{}}>
          <Text
            style={{
              fontWeight: "bold",
              color: "#767A7F",
              fontSize: 16,
              paddingLeft: 17,
              marginTop: 10,
            }}
          >
            {" "}
            Các câu hỏi thường gặp {" >"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            Login();
          }}
          style={{
            borderRadius: 100,
            width: 50,
            height: 50,
            backgroundColor: isFieldsFilled ? "#006AF5" : "gray",
            justifyContent: "center",
            alignItems: "center",
          }}
          disabled={!isFieldsFilled}
        >
          <MaterialIcons name="arrow-forward" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  ViewTop: {
    width: "100%",
    height: 50,
    backgroundColor: "#E9EBED",
    justifyContent: "center",
    alignItems: "center",
  },
  ViewInput: {
    width: "100%",
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  inputPass: {
    width: "90%",
    height: 50,
    fontSize: 19,
  },
  input: {
    width: "90%",
    height: 50,
    fontSize: 19,
    borderBottomWidth: 1,
  },
  ViewBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    bottom: 20,
    position: "absolute",
  },
});
