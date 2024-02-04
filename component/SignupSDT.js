import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import CountryPicker from "react-native-country-picker-modal";
import PhoneNumber from "libphonenumber-js";
export default function App({ navigation, route }) {
  const [SDT, setSDT] = useState("");
  const [password, setPassword] = useState("");
  const [isSecureEntry, setIsSecureEntry] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);
  const [isNext, setIsNext] = useState(false);
  const clearTextInput = () => {
    setSDT("");
    setErrorSDT("");
  };
  const handleCheckbox = () => {
    setIsChecked(!isChecked);
  };
  const handleCheckbox2 = () => {
    setIsChecked2(!isChecked2);
  };
  useEffect(() => {
    if (isChecked && password.length!=0 && isChecked2 && SDT.length != 0) {
      setIsNext(true);
    } else {
      setIsNext(false);
    }
  }, [isChecked, isChecked2, SDT.length, password]);
  const [countryCode, setCountryCode] = useState("VN");
  const [callingCode, setCallingCode] = useState("+84");
  const handleCountryChange = (country) => {
    setCountryCode(country.cca2);
    setCallingCode("+" + country.callingCode.join(""));
    

    // Thực hiện bất kỳ điều gì khác khi chọn quốc gia
  };
  // console.log(callingCode);
  const [errorSDT, setErrorSDT] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  function handelTaoSDT() {
    // console.log("countryCode"+countryCode);

    const phoneNumber = PhoneNumber.isPossibleNumber(SDT, countryCode);
    if (phoneNumber) {
      const formattedSDT = SDT.replace(/^0+/, '');
      //loại bỏ số 0 ở đầu số điện thoại
      if (password.length >= 6) {
        
        
        setErrorSDT("");
        setErrorPassword("");
        navigation.navigate("SignupAuth", {
          SDT: formattedSDT,
          callingCode: callingCode,
          name: route.params.name,
          password: password,
        });
      } else {
        setErrorSDT("");
        setErrorPassword("Mật khẩu phải có ít nhất 6 ký tự");
      }
    } else {
      setErrorPassword("");
      setErrorSDT("Số điện thoại không hợp lệ cho quốc gia đã chọn");
    }
  }
  // useEffect(() => {
  //   console.log(countryCode);
  // }, [countryCode]);
  return (
    <View style={styles.container}>
      <View style={styles.ViewTop}>
        <Text>Vui lòng nhập số điện thoại và mật khẩu để đăng nhập</Text>
      </View>
      <View style={styles.ViewBottom}>
        <View
          style={{
            width: "100%",
            paddingRight: 20,
            flexDirection: "row",
            alignItems: "center",
            borderBottomWidth: 1,
            borderBottomColor: "blue",
          }}
        >
          <CountryPicker
            containerButtonStyle={{ marginTop: 15 }}
            withCallingCode
            withFilter
            withFlag
            onSelect={handleCountryChange}
            countryCode={countryCode}
          />
          {/* <Text style={{marginTop:10,fontSize:16  }}> */}
          {/* {'(+'}{callingCode}{") "} */}
          {/* </Text> */}
          <TextInput
            style={styles.input}
            placeholder="Nhập số điện thoại"
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus={true}
            keyboardType="phone-pad"
            value={SDT}
            onChangeText={(text) => setSDT(text)}
          />
          {SDT.length > 0 && (
            <TouchableOpacity
              style={{ marginTop: 10 }}
              onPress={clearTextInput}
            >
              <MaterialIcons name="clear" size={31} color="gray" />
            </TouchableOpacity>
          )}
        </View>
        <View style={{  width: "100%",
            paddingRight: 20,
            flexDirection: "row",
            alignItems: "center",
            borderBottomWidth: 1,
            borderBottomColor: "blue",}}>
          <TextInput
            style={styles.input}
            placeholder="Nhập mật khẩu"
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={isSecureEntry}
            textContentType="password"
            value={password}
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
        <Text style={{ fontSize: 16, color: "red", marginTop: 15 }}>
          {errorSDT}
          {errorPassword}
        </Text>
        <View style={styles.checkboxContainer}>
          <TouchableOpacity onPress={handleCheckbox}>
            {isChecked ? (
              <MaterialIcons name="check-box" size={24} color="blue" />
            ) : (
              <MaterialIcons
                name="check-box-outline-blank"
                size={24}
                color="gray"
              />
            )}
          </TouchableOpacity>
          <Text style={{ fontSize: 17 }}>Tôi đồng ý với các </Text>
          <TouchableOpacity>
            <Text style={{ color: "blue", fontSize: 17 }}>
              {" "}
              điều khoản sử dụng Zalo
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.checkboxContainer}>
          <TouchableOpacity onPress={handleCheckbox2}>
            {isChecked2 ? (
              <MaterialIcons name="check-box" size={24} color="blue" />
            ) : (
              <MaterialIcons
                name="check-box-outline-blank"
                size={24}
                color="gray"
              />
            )}
          </TouchableOpacity>
          <Text style={{ fontSize: 17 }}>Tôi đồng ý với </Text>
          <TouchableOpacity>
            <Text style={{ color: "blue", fontSize: 17 }}>
              {" "}
              điều khoản Mạng xã hội
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        onPress={handelTaoSDT}
        style={{
          borderRadius: 100,
          width: 50,
          height: 50,
          backgroundColor: isNext ? "blue" : "gray",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          bottom: 30,
          right: 30,
        }}
        disabled={!isNext}
      >
        <MaterialIcons name="arrow-forward" size={24} color="white" />
      </TouchableOpacity>
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
  },
  input: {
    marginTop: 15,
    width: "90%",
    height: 50,
    fontSize: 19,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
});
