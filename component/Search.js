import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
} from "react-native";
import {
  Ionicons,
  Feather,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import axiosPrivate from "../api/axiosPrivate.js";
function FormatTenQuaDai(text, maxLength) {
  return text.length > maxLength
    ? text.substring(0, maxLength - 3) + "..."
    : text;
}
export default function User({ navigation }) {
  const [searchText, setSearchText] = useState("");
  const [users, setUsers] = useState([]);
  useEffect(() => {
    (async () => {
      const users = await axiosPrivate("/user");
      setUsers(users);
    })();
  }, []);
  //hàm render danh sách liên hệ đẫ tìm
  const renderUserItem = ({ item }) => (
    <TouchableOpacity onPress={() => { }}>
      <View style={{ alignItems: "center", width: 100 }}>
        <Image
          style={{
            width: 55,
            height: 55,
            borderRadius: 50 / 2,
          }}
          source={{ uri: item.avatar }}
        />
        <Text style={{ fontSize: 20, fontWeight: "400", textAlign: "center" }}>
          {FormatTenQuaDai(item.name, 18)}
        </Text>
      </View>
    </TouchableOpacity>
  );
  //Hàm render danh sách tìm kiếm
  const renderUserItemSearch = ({ item }) => (

    <TouchableOpacity onPress={() => { console.log(item); navigation.navigate('Conversations', { searchUser: item }) }}>
      <View
        style={{
          alignItems: "center",
          width: "100%",
          flexDirection: "row",
          padding: 15,
          paddingRight: 25,
          justifyContent: "space-between",
        }}
      >
        <View style={{ alignItems: "center", flexDirection: "row", gap: 15 }}>
          <Image
            style={{
              width: 55,
              height: 55,
              borderRadius: 50 / 2,
            }}
            source={{ uri: item.avatar }}
          />
          <Text
            style={{ fontSize: 20, fontWeight: "400", textAlign: "center" }}
          >
            {FormatTenQuaDai(item.name, 18)}
          </Text>
        </View>
        <TouchableOpacity
          style={{
            width: 45,
            height: 45,
            borderRadius: 50,
            backgroundColor: "#E0FFFF",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Feather name="phone" size={20} color="#006AF5" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
  // Lọc danh sách liên hệ theo tên
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          height: 56,
          alignItems: "center",
          backgroundColor: "#0895FB",
          width: "100%",
        }}
      >
        <TouchableOpacity
          style={{ marginLeft: 20 }}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Ionicons name="arrow-back-outline" size={28} color="white" />
        </TouchableOpacity>

        <View
          style={{
            marginLeft: 20,
            fontWeight: "bold",
            backgroundColor: "white",
            borderRadius: 8,
            width: 255,
            height: 33,
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: 8,
            marginRight: 20,
          }}
        >
          <Feather name="search" size={24} color="#767A7F" />
          <TextInput
            placeholder="Tìm kiếm"
            autoFocus={true}
            placeholderTextColor={"#767A7F"}
            style={{
              marginLeft: 10,
              fontWeight: "400",
              fontSize: 18,
              width: 180,
              height: 28,
              color: "black",
            }}
            onChangeText={(text) => setSearchText(text)}
            value={searchText}
          />

          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText("")}>
              <MaterialIcons name="cancel" size={24} color="#767A7F" />
            </TouchableOpacity>
          )}
        </View>
        <MaterialCommunityIcons name="qrcode-scan" size={24} color="white" />
      </View>
      {/* ======================================= */}
      {searchText.length == 0 ? (
        <View style={{ flex: 1, padding: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: 600 }}>Liên hệ đã tìm</Text>
          <FlatList
            data={users}
            horizontal
            //   keyExtractor={(item) => item.id.toString()}
            renderItem={renderUserItem}
          //   contentContainerStyle={styles.userList}
          />
        </View>
      ) : filteredUsers.length === 0 ? (
        // Hiển thị nội dung khi không có kết quả tìm kiếm
        <Text style={{ fontSize: 18, fontWeight: 600, textAlign: "center" }}>
          Không có kết quả tìm kiếm
        </Text>
      ) : (
        // Hiển thị danh sách kết quả tìm kiếm
        <FlatList
          data={filteredUsers}
          renderItem={renderUserItemSearch}
        //   keyExtractor={(item) => item.id.toString()}
        //   contentContainerStyle={styles.userList}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  FlatList: {
    marginRight: 10,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
});
