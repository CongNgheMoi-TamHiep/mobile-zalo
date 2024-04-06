import React, { useEffect, useState, useContext } from "react";
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
import { AuthenticatedUserContext } from "../App.js";
import { useNavigation } from "@react-navigation/native";

import * as Contacts from "expo-contacts";
import { set } from "date-fns";
const Tab = createMaterialTopTabNavigator();
//hàm cắt tên quá dài
function FormatTenQuaDai(text, maxLength) {
  return text.length > maxLength
    ? text.substring(0, maxLength - 3) + "..."
    : text;
}

function BanBe() {
  const navigation = useNavigation();

  const { user } = useContext(AuthenticatedUserContext);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchUserData();
    });
    return unsubscribe;
  }, [navigation]);
  
  const fetchUserData = async () => {
      try{ const users = await axiosPrivate(`/friends/${user.uid}`);
      // lọc ra những người dùng không phải là mình
      const new_User = users.filter((item) => item.number !== user.phoneNumber);
      setUsers(new_User);}
      catch (error) {
        console.error("Error fetching user data: ", error);
      }
    
  };
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
          onPress={() => navigation.navigate("FriendRequest")}
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
  const [contacts, setContacts] = useState([]);
  function FormatTenQuaDai(text, maxLength) {
    return text.length > maxLength
      ? text.substring(0, maxLength - 3) + "..."
      : text;
  }
  // lấy chủ tài khoản
  const { user } = useContext(AuthenticatedUserContext);
  //Lấy danh sách bạn bè
  const [users, setUsers] = useState([]);
  const [phonebook, setPhonebook] = useState([]);
  useEffect(() => {
    (async () => {
      const users = await axiosPrivate("/user");
      // lấy friends của user hiện hành
      const friends = await axiosPrivate(`/friends/${user.uid}`);
      setPhonebook(friends.phoneBook);
      setUsers(users);
    })();
  }, []);
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
  // format danh bạ máy về dạng mảng object {nameDanhBa, number}
  const formatContacts = contacts.map((v) => {
    return {
      nameDanhBa: v.name,
      number: v.phoneNumbers[0].number,
    };
  });
  // kiểm tra trên database có phonebook không, nếu không có thì lấy danh bạ máy, nếu có thì lấy phonebook
  const phonebook1 = phonebook.length != 0 ? phonebook : formatContacts;

  // lọc ra những người có sdt và lọc ra những người trong danh bạ có đang dùng zalo
  const NguoiDungCoZola = phonebook1.filter((item) => {
    return item.number.length > 0 && isCoDungZL(item.number);
  });
  
  // Sắp xếp danh sách conTacst theo tên (name)

  const sortedData = NguoiDungCoZola
    .slice()
    .sort((a, b) => a.nameDanhBa.localeCompare(b.nameDanhBa));

  // Tạo một đối tượng để nhóm các tên theo chữ cái
  const groupedData = {};
  sortedData.forEach((item) => {
    const firstChar = item.nameDanhBa.charAt(0).toUpperCase();
    if (!groupedData[firstChar]) {
      groupedData[firstChar] = [];
    }
    groupedData[firstChar].push(item);
  });

  return (
    <View style={styles.container}>
      <View
        style={{
          width: "100%",
          height: 50,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "500", padding: 10 }}>
          Lần cập nhật danh bạ gần nhất
        </Text>
        <TouchableOpacity style={{}}>
          <Text style={{ fontSize: 16, fontWeight: "500", color: "#00aaff" }}>
            Cập nhật
          </Text>
        </TouchableOpacity>
      </View>
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
                    source={{
                      uri: users.find(
                        (user) => "0" + user.number.slice(3) === item.number
                      )?.avatar,
                    }}
                  />

                  <View>
                    <Text style={{ fontSize: 19, fontWeight: "400" }}>
                      {FormatTenQuaDai(item.nameDanhBa, 19)}
                    </Text>
                    <Text
                      style={{
                        fontSize: 17,
                        fontWeight: "400",
                        color: "#767A7F",
                      }}
                    >
                      Tên zola:{" "}
                      {
                        users.find(
                          (user) => "0" + user.number.slice(3) === item.number
                        )?.name
                      }
                    </Text>
                  </View>
                </View>

                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {isCoDungZL(item.number) ? (
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
      {/* <Tab.Screen name="Danh bạ máy" component={DanhBaMay} /> */}
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
