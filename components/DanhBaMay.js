import React, { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import axiosPrivate from "../api/axiosPrivate.js";
import { useFocusEffect } from "@react-navigation/native";
import { AuthenticatedUserContext } from "../App.js";
import { useNavigation } from "@react-navigation/native";

import * as Contacts from "expo-contacts";
import { set } from "date-fns";
//hàm cắt tên quá dài
function FormatTenQuaDai(text, maxLength) {
  return text.length > maxLength
    ? text.substring(0, maxLength - 3) + "..."
    : text;
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
      fetchContacts();
      const users = await axiosPrivate("/user");
      // lấy friends của user hiện hành
      const friends = await axiosPrivate(`/friends/${user.uid}`);
      setPhonebook(friends.phoneBook);
      setUsers(users);
    })();
  }, []);
  // hàm trả về trạng thái kết bạn
  async function isFriend(id) {
    const stateFriend = await axiosPrivate("/friendRequest/state", {
      params: { userId1: user.uid, userId2: id },
    });
    console.log("object", stateFriend);
    return stateFriend;
  }

  //hàm kiểm tra xem sdt đó có đang dùng zalo không, có thì trả về user đó
  function isCoDungZL(sdt) {
    const userWithPhoneNumber = users.find((user) => {
      let number = "0" + user.number.slice(3);
      return number === sdt;
    });
    return userWithPhoneNumber;
  }

  // hàm lấy danh bạ máy
  const fetchContacts = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === "granted") {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Name],
      });
      setContacts(data);
    }
  };
  // format danh bạ máy về dạng mảng object {nameDanhBa, number}
  const handleFormatContacts = (contacts) => {
    const a = contacts.filter((item) => {
      return (
        item.phoneNumbers &&
        item.phoneNumbers.length > 0 &&
        isCoDungZL(item.phoneNumbers[0].number)
      );
    });

    return a.map((v) => {
      const user = isCoDungZL(v.phoneNumbers[0].number);
      return {
        userId: user._id,
        nameDanhBa: v.name,
        number: v.phoneNumbers[0].number,
      };
    });
  };

  // kiểm tra trên database có phonebook không, nếu không có thì lấy danh bạ máy, nếu có thì lấy phonebook
  const phonebook1 = phonebook ? phonebook : handleFormatContacts(contacts);
  // cập nhật danh bạ máy lên api
  useEffect(() => {
    if (phonebook) {
      return;
    } else {
      const formatContacts = handleFormatContacts(contacts);
      uploadPhoneBook(formatContacts);
      console.log("upload phonebook success");
    }
  }, [phonebook1]);

  // Sắp xếp danh sách conTacst theo tên (name)
  const sortedData = phonebook1
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
  // hàm đưa contacts lên api vào phoenbook
  async function uploadPhoneBook(formatContacts) {
    try {
      await axiosPrivate.patch(`/friends/update-phonebook/${user.uid}`, {
        phoneBook: formatContacts,
      });
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
  }
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
        <TouchableOpacity
          onPress={() => {
            uploadPhoneBook(handleFormatContacts(contacts));
          }}
          style={{}}
        >
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
                      onPress={() => {
                        console.log("Kết bạn", item.userId);
                      }}
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

export default DanhBaMay;

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
