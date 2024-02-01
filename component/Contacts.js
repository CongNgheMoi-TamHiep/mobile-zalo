import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import axiosPrivate from "../api/axiosPrivate.js";
import { useFocusEffect } from "@react-navigation/native";

import * as Contacts from "expo-contacts";
const Tab = createMaterialTopTabNavigator();

//hàm cắt tên quá dài
function FormatTenQuaDai(text, maxLength) {
  return text.length > maxLength
    ? text.substring(0, maxLength - 3) + "..."
    : text;
}

function BanBe() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    (async () => {
      const users = await axiosPrivate("/user");
      setUsers(users);
    })();
  }, []);

  // Sắp xếp danh sách bạn bè theo tên (name)
  let sortedData = users.slice().sort((a, b) => a.name.localeCompare(b.name));

  // Tạo một đối tượng để nhóm các tên theo chữ cái
  let groupedData = {};
  sortedData.forEach((item) => {
    let firstChar = item.name.charAt(0).toUpperCase();
    if (!groupedData[firstChar]) {
      groupedData[firstChar] = [];
    }
    groupedData[firstChar].push(item);
  });

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.ViewTop}>
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <View
              style={{
                width: 36,
                height: 36,
                backgroundColor: "#00aaff",
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialIcons name="people-alt" size={23} color="white" />
            </View>
            <Text style={{ fontSize: 19, fontWeight: "400", marginLeft: 15 }}>
              Lời mời kết bạn
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <View
              style={{
                width: 36,
                height: 36,
                backgroundColor: "#00aaff",
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FontAwesome5 name="birthday-cake" size={23} color="white" />
            </View>
            <Text style={{ fontSize: 19, fontWeight: "400", marginLeft: 15 }}>
              Lịch sinh nhật
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ width: "100%", height: 8, backgroundColor: "#ccc" }} />

        {Object.keys(groupedData).map((char, index) => (
          <View key={index}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginLeft: 10 }}>
              {char}
            </Text>
            {groupedData[char].map((item, itemIndex) => (
              //các item(người dùng)
              <TouchableOpacity
                key={itemIndex}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 15,
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 50 / 2,
                      marginRight: 15,
                    }}
                    source={{ uri: item.avatar }}
                  />
                  <Text style={{ fontSize: 19, fontWeight: "400" }}>
                    {FormatTenQuaDai(item.name, 19)}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TouchableOpacity style={{ marginLeft: 80 }}>
                    <Feather name="phone" size={24} color="black" />
                  </TouchableOpacity>
                  <TouchableOpacity style={{ marginLeft: 20 }}>
                    <Feather name="video" size={26} color="black" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function DanhBaMay() {
  const [isKetBan, setIsKetBan] = useState(false);
  const [contacts, setContacts] = useState([]);
  function FormatTenQuaDai(text, maxLength) {
    return text.length > maxLength
      ? text.substring(0, maxLength - 3) + "..."
      : text;
  }
  useFocusEffect(
    React.useCallback(() => {
      // Thực hiện tác vụ fetch danh bạ máy khi tab được chọn
      const fetchContacts = async () => {
        const { status } = await Contacts.requestPermissionsAsync();
        if (status === "granted") {
          const { data } = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Name],
          });
          setContacts(data);
        }
      };
      fetchContacts();
      // Cleanup function, sẽ được gọi khi tab không còn được chọn
      return () => {
        // Thực hiện các công việc cleanup nếu cần
      };
    }, [])
  );
  // console.log(contacts);
  // Sắp xếp danh sách conTacst theo tên (name)
  const sortedData = contacts
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));

  // Tạo một đối tượng để nhóm các tên theo chữ cái
  const groupedData = {};
  sortedData.forEach((item) => {
    const firstChar = item.name.charAt(0).toUpperCase();
    if (!groupedData[firstChar]) {
      groupedData[firstChar] = [];
    }
    groupedData[firstChar].push(item);
  });
  //Lấy danh sách bạn bè
  const [users, setUsers] = useState([]);
  useEffect(() => {
    (async () => {
      const users = await axiosPrivate("/user");
      setUsers(users);
    })();
  }, []);
  // console.log(users);
  //hàm kiểm tra xem sdt đó có đang dùng zalo không
  function isCoDungZL(sdt) {
    const isCoDungZL = users.find((user) => {
      let number = "0" + user.number.slice(3);
      return number === sdt;
    });
    if (isCoDungZL) {
      return true;
    } else {
      return false;
    }
  }
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={{ width: "100%", height: 8, backgroundColor: "#ccc" }} />

        {Object.keys(groupedData).map((char, index) => (
          <View key={index}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginLeft: 10 }}>
              {char}
            </Text>
            {groupedData[char].map((item, itemIndex) => (
              //các item(người dùng)
              <TouchableOpacity
                key={itemIndex}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 15,
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 50 / 2,
                      marginRight: 15,
                    }}
                    //thiếu kiểm tra kết bạn hay chưa
                    source={
                      isCoDungZL(item.phoneNumbers[0].number)
                        ? require("../assets/chuaketban.png")
                        : require("../assets/khongcoZL.png")
                    }
                  />
                  <View>
                    <Text style={{ fontSize: 19, fontWeight: "400" }}>
                      {FormatTenQuaDai(item.name, 19)}
                    </Text>
                    <Text
                      style={{
                        fontSize: 17,
                        fontWeight: "400",
                        color: isCoDungZL(item.phoneNumbers[0].number)
                          ? "#767A7F"
                          : "#CD5C5C",
                      }}
                    >
                      {isCoDungZL(item.phoneNumbers[0].number)
                        ? "Tên Zola: " + FormatTenQuaDai(item.name, 19)
                        : "Chưa đăng ký"}
                    </Text>
                  </View>
                </View>

                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {isCoDungZL(item.phoneNumbers[0].number) ? (
                    <TouchableOpacity
                      style={{
                        width: 79,
                        height: 30,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 15,
                        backgroundColor: "#CFFFFF",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "400",
                          color: "#006AF5",
                        }}
                      >
                        Kết bạn
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={{
                        width: 75,
                        height: 30,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 15,
                        backgroundColor: "#CFFFFF",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "400",
                          color: "#006AF5",
                        }}
                      >
                        Mời 
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

export default function Contact() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: { fontSize: 13, fontWeight: "bold" },
        tabBarItemStyle: { width: 130 },
      }}
    >
      <Tab.Screen name="Bạn bè" component={BanBe} />
      <Tab.Screen name="Danh bạ máy" component={DanhBaMay} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  ViewTop: {
    width: "100%",
    height: 140,
    padding: 15,
    justifyContent: "space-around",
  },
});
