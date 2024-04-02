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
  const [sdt, setsdt] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isFocusedSdt, setIsFocusedSdt] = useState(false);
  // chọn quốc gia
  useEffect(() => {
    setIsFieldsFilled(sdt !== "");
  }, [sdt]);
  const [isFieldsFilled, setIsFieldsFilled] = useState(false);
  const [countryCode, setCountryCode] = useState("VN");
  const [callingCode, setCallingCode] = useState("+84");
  const handleCountryChange = (country) => {
    setCountryCode(country.cca2);
    setCallingCode("+" + country.callingCode.join(""));
  };
  function TiepTuc() {
    const phoneNumber = PhoneNumber.isPossibleNumber(sdt, countryCode);
    if (phoneNumber) {
      const formattedSDT = sdt.replace(/^0+/, "");
      navigation.navigate("ForgetPasswordOTP", { sdt: formattedSDT });
    } else {
      setErrorMessage("Số điện thoại không hợp lệ cho quốc gia đã chọn");
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.ViewTop}>
        <Text>Vui lòng nhập số điện thoại để lấy lại mật khẩu</Text>
      </View>
      <View style={styles.ViewInput}>
        <View
          style={{
            width: "90%",
            flexDirection: "row",
            alignItems: "center",
            borderBottomWidth: 1,
            height: 50,
            borderBottomColor: isFocusedSdt ? "blue" : "gray",
          }}
        >
          <CountryPicker
            containerButtonStyle={{ marginTop: 0 }}
            withCallingCode
            withFilter
            withFlag
            onSelect={handleCountryChange}
            countryCode={countryCode}
          />
          <TextInput
            style={[styles.input]}
            placeholder="Số điện thoại"
            autoCapitalize="none"
            keyboardType="phone-pad"
            autoFocus={true}
            value={sdt}
            onFocus={() => setIsFocusedSdt(true)}
            onBlur={() => setIsFocusedSdt(false)}
            onChangeText={(text) => setsdt(text)}
          />
        </View>
      </View>
      <Text
        style={{ fontSize: 18, color: "red", marginLeft: 17 }}
      >
        {errorMessage}
      </Text>
      <View
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            TiepTuc();
          }}
          style={{
            borderRadius: 19,
            width: 100,
            height: 39,
            backgroundColor: isFieldsFilled ? "#006AF5" : "gray",
            justifyContent: "center",
            alignItems: "center",
          }}
          disabled={!isFieldsFilled}
        >
          <Text style={{ color: "white" }}>Tiếp tục</Text>
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
