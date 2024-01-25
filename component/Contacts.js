import React from "react";
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

const Tab = createMaterialTopTabNavigator();

function BanBe() {
  
  const data = [
    {
      name: "Nguyễn Văn A",
      avatar: require("../assets/aa.png"),
    },
    {
      name: "aguyễn Văn B",
      avatar: require("../assets/aa.png"),
    },
    {
      name: "aguyễn Văn C",
      avatar: require("../assets/aa.png"),
    },
    {
      name: "bguyễn Văn C",
      avatar: require("../assets/aa.png"),
    },
    {
      name: "bguyễn Văn C",
      avatar: require("../assets/aa.png"),
    },
    {
      name: "tguyễn Văn C",
      avatar: require("../assets/aa.png"),
    },
    {
      name: "mguyễn Văn C",
      avatar: require("../assets/aa.png"),
    },
  ];

  // Sắp xếp danh sách bạn bè theo tên (name)
  const sortedData = data.slice().sort((a, b) => a.name.localeCompare(b.name));

  // Tạo một đối tượng để nhóm các tên theo chữ cái
  const groupedData = {};
  sortedData.forEach(item => {
    const firstChar = item.name.charAt(0).toUpperCase();
    if (!groupedData[firstChar]) {
      groupedData[firstChar] = [];
    }
    groupedData[firstChar].push(item);
  });

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.ViewTop}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
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
              <MaterialIcons name="people-alt" size={24} color="white" />
            </View>
            <Text style={{ fontSize: 20, fontWeight: "400", marginLeft: 15 }}>
              Lời mời kết bạn
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
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
              <FontAwesome5 name="birthday-cake" size={24} color="white" />
            </View>
            <Text style={{ fontSize: 20, fontWeight: "400", marginLeft: 15 }}>
              Lịch sinh nhật
            </Text>
          </View>
        </View>
        <View style={{ width: "100%", height: 8, backgroundColor: "#ccc" }} />

        {Object.keys(groupedData).map((char, index) => (
          <View key={index}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 10 }}>{char}</Text>
            {groupedData[char].map((item, itemIndex) => (
              <View
                key={itemIndex}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 15,
                }}
              >
                <Image
                  style={{
                    width: 55,
                    height: 55,
                    borderRadius: 50 / 2,
                    marginRight: 15,
                  }}
                  source={item.avatar}
                />
                <Text style={{ fontSize: 20, fontWeight: "400" }}>
                  {item.name}
                </Text>
                <TouchableOpacity style={{ marginLeft: 80 }}>
                  <Feather name="phone" size={26} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={{ marginLeft: 20 }}>
                  <Feather name="video" size={28} color="black" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function DanhBaMay() {
  return (
    <View style={styles.container}>
      <Text>DanhBaMay</Text>
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
