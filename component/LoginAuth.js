import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { firebaseConfig } from "../config/firebase.js";
import firebase from "firebase/compat/app";
export default function App({ navigation, route }) {
  const handelContinue = () => {
    

  };
  
  return (
    <View style={styles.container}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
      />
      <View style={styles.ViewTop}>
        <Text>Vui lòng không chia sẻ mã xác thực để tránh mất tài khoản</Text>
      </View>
      <View style={styles.ViewBottom}>
        <View
          style={{
            width: 66,
            height: 66,
            borderWidth: 1,
            borderColor: "gray",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 100,
          }}
        >
          <FontAwesome5 name="sms" size={49} color="green" />
        </View>
        <Text style={{ fontSize: 18, marginTop: 10, fontWeight: 700 }}>
          Đang gửi mã OTP đến số {"("}
          {route.params.callingCode}
          {") "}
          {route.params.SDT}{" "}
        </Text>
        <Text style={{ fontSize: 16, marginTop: 10, fontWeight: 300 }}>
          Vui lòng nhập mã xác thực{" "}
        </Text>
        <View style={styles.verificationContainer}>
          <TextInput
            style={styles.input}
            placeholder="•  •  •  •  •  •"
            maxLength={6}
            keyboardType="numeric"
            value={verificationCode}
            onChangeText={(text) => setVerificationCode(text)}
          />
        </View>
        <Text
          style={{ fontSize: 16, marginTop: 10, fontWeight: 500, color: "red" }}
        >
          {errorCode}
        </Text>
        <View style={{ flexDirection: "row", marginTop: 20 }}>
          {timer > 0 ? (
            <Text style={{ fontSize: 18, color: "gray" }}>
              Gửi lại mã ({timer}s)
            </Text>
          ) : (
            <TouchableOpacity onPress={handleResend}>
              <Text style={{ fontSize: 18, color: "blue" }}> Gửi lại mã</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={{
            borderRadius: 50,
            width: 150,
            height: 50,
            backgroundColor: isEnterCode ? "blue" : "gray",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
          }}
          disabled={!isEnterCode}
          onPress={handelContinue}
        >
          <Text style={{ fontSize: 18, color: "white", fontWeight: 700, }}>
            Tiếp tục
          </Text>
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
    backgroundColor: "gray",
    justifyContent: "center",
    alignItems: "center",
  },
  ViewBottom: {
    width: "100%",
    padding: 20,
    alignItems: "center",
  },
  verificationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 27,
  },
  input: {
    width: 120,
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: "black",
    marginHorizontal: 5,
    fontSize: 24,
    textAlign: "center",
  },
});
