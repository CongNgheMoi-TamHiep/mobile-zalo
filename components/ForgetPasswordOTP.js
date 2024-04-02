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
import CountryPicker from "react-native-country-picker-modal";
import PhoneNumber from "libphonenumber-js";
export default function App({ navigation }) {
  return (
    <View style={styles.container}>
     
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
