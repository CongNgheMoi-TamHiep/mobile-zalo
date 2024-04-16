import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SectionList,
  Modal,
} from "react-native";
import { Video, ResizeMode } from "expo-av";

import {
  EvilIcons,
  MaterialIcons,
  Ionicons,
  SimpleLineIcons,
  Entypo,
  FontAwesome,
  Feather,
  AntDesign,
  FontAwesome6,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useCurrentUser } from "../App";
import axiosPrivate from "../api/axiosPrivate";
const OptionChat = ({ navigation, route }) => {
  const [showModal, setShowModal] = useState(false);
  const [isGroup, setIsGroup] = useState(false);
  const [dataConversation, setDataConversation] = useState({});
  const [isLeader, setIsLeader] = useState(false);
  const currentUser = useCurrentUser();
  useEffect(() => {
    setDataConversation(route.params.conversationInfo);
    if (route.params.conversationInfo.type === "group") {
      setIsGroup(true);
      if (route.params.conversationInfo.adminId == currentUser.user.uid) {
        setIsLeader(true);
      }
    } else {
      setIsGroup(false);
    }
  }, []);

  async function GiaiTanNhom(){
    try {
        const response = await axiosPrivate.delete(
          `/group/dissolution/${dataConversation.conversationId}`
        );
        navigation.navigate("Messages");
      } catch (error) {
        console.error("Giải tán nhóm false:", error);
      }
  }
  return (
    <View style={styles.container}>
      <ScrollView style={{ width: "100%", height: "100%" }}>
        <View style={styles.ViewTop}>
          <TouchableOpacity activeOpacity={0.8}>
            <Image
              style={{ width: 90, height: 90, borderRadius: 50 }}
              source={{
                uri: isGroup
                  ? dataConversation?.image
                  : dataConversation?.user?.avatar,
              }}
            />
          </TouchableOpacity>

          {isGroup ? (
            <Text style={{ fontSize: 19, fontWeight: 500, marginTop: 7 }}>
              {dataConversation?.name}
            </Text>
          ) : (
            <Text style={{ fontSize: 19, fontWeight: 500, marginTop: 7 }}>
              {dataConversation?.user?.name}
            </Text>
          )}
          <View style={styles.ViewBottomTop}>
            <View style={styles.ViewItemTop}>
              <TouchableOpacity style={styles.ViewButtonTop}>
                <AntDesign name="search1" size={24} color="black" />
              </TouchableOpacity>

              <Text
                style={{
                  width: 60,
                  height: 50,
                  fontSize: 14,
                  textAlign: "center",
                }}
              >
                Tìm{"\n"}tin nhắn
              </Text>
            </View>
            {isGroup ? (
              <View style={styles.ViewItemTop}>
                <TouchableOpacity style={styles.ViewButtonTop}>
                  <AntDesign name="addusergroup" size={24} color="black" />
                </TouchableOpacity>

                <Text
                  style={{
                    width: 70,
                    height: 50,
                    fontSize: 14,
                    textAlign: "center",
                  }}
                >
                  Thêm{"\n"}thành viên
                </Text>
              </View>
            ) : (
              <View style={styles.ViewItemTop}>
                <TouchableOpacity style={styles.ViewButtonTop}>
                  <Feather name="user" size={24} color="black" />
                </TouchableOpacity>

                <Text
                  style={{
                    width: 60,
                    height: 50,
                    fontSize: 14,
                    textAlign: "center",
                  }}
                >
                  Trang{"\n"}cá nhân
                </Text>
              </View>
            )}

            <View style={styles.ViewItemTop}>
              <TouchableOpacity style={styles.ViewButtonTop}>
                <Ionicons
                  name="color-palette-outline"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>

              <Text
                style={{
                  width: 60,
                  height: 50,
                  fontSize: 14,
                  textAlign: "center",
                }}
              >
                Đổi{"\n"}hình nền
              </Text>
            </View>
            <View style={styles.ViewItemTop}>
              <TouchableOpacity
                style={styles.ViewButtonTop}
                onPress={() => setShowModal(true)}
              >
                <SimpleLineIcons name="bell" size={24} color="black" />
              </TouchableOpacity>
              <Modal
                animationType="slide"
                transparent={true}
                onBackdropPress={() => setShowModal(false)}
                visible={showModal}
              >
                <View style={styles.modalBackground}>
                  <View style={styles.modalContent}>
                    <TouchableOpacity style={styles.modalOption}>
                      <Text style={{ color: "#767A7F", fontSize: 12 }}>
                        Không thông báo tin nhắn tới của hội thoại này
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalOption}>
                      <Text style={styles.modalText}>Trong 1 giờ</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalOption}>
                      <Text style={styles.modalText}>Trong 4 giờ</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalOption}>
                      <Text style={styles.modalText}>Đến 8 giờ sáng</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalOption}>
                      <Text style={styles.modalText}>
                        Cho đến khi được mở lại
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.modalOption, { borderBottomWidth: 0 }]}
                      onPress={() => setShowModal(false)} // Đóng modal khi nhấn vào
                    >
                      <Text
                        style={{
                          color: "#006AF5",
                          fontWeight: "bold",
                          fontSize: 16,
                        }}
                      >
                        Hủy
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>

              <Text
                style={{
                  width: 60,
                  height: 50,
                  fontSize: 13,
                  textAlign: "center",
                }}
              >
                Tắt{"\n"}thông báo
              </Text>
            </View>
          </View>
        </View>

        {isGroup ? null : (
          <View
            style={{
              backgroundColor: "white",
              width: "100%",
              marginVertical: 1,
            }}
          >
            <TouchableOpacity style={styles.item}>
              <View style={styles.contentButton}>
                <Feather name="edit-3" size={22} color="#767A7F" />
                <Text style={styles.text}>Đổi tên gợi nhớ </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        <View
          style={{ backgroundColor: "white", width: "100%", marginVertical: 1 }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("OptionChat2", { account: route.params });
            }}
            activeOpacity={0.7}
            style={[styles.item, { height: 125 }]}
          >
            <View style={[styles.contentButton]}>
              <Ionicons name="folder-outline" size={22} color="#767A7F" />
              <View style={{}}>
                <Text style={styles.text}>Ảnh, file, link đã gửi</Text>
                <View style={{ flexDirection: "row", gap: 5 }}>
                  {/* {isGroup? firtFourImageGroup.map((item, index) => {
                    return item.messageType === "VIDEO" ? (
                      <Video
                        key={index}
                        source={{ uri: item.url }}
                        style={{ width: 57, height: 67, borderRadius: 10 }}
                        useNativeControls
                        resizeMode="contain"
                      />
                    ) : (
                      <Image
                        key={index}
                        source={{ uri: item.url }}
                        style={{ width: 57, height: 67, borderRadius: 10 }}
                      />
                    );
                  }):firtFourImage.map((item, index) => {
                    return item.messageType === "VIDEO" ? (
                      <Video
                        key={index}
                        source={{ uri: item.url }}
                        style={{ width: 57, height: 67, borderRadius: 10 }}
                        useNativeControls
                        resizeMode="contain"
                      />
                    ) : (
                      <Image
                        key={index}
                        source={{ uri: item.url }}
                        style={{ width: 57, height: 67, borderRadius: 10 }}
                      />
                    );
                  })}

                   */}
                  <View
                    style={{
                      width: 57,
                      height: 67,
                      borderRadius: 10,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#B9BDC1",
                    }}
                  >
                    <MaterialIcons
                      name="navigate-next"
                      size={24}
                      color="black"
                    />
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {isGroup ? (
          <View
            style={{
              backgroundColor: "white",
              width: "100%",
              marginVertical: 1,
            }}
          >
            <TouchableOpacity style={styles.item}>
              <View style={styles.contentButton}>
                <Ionicons name="calendar-outline" size={22} color="#767A7F" />
                <Text style={styles.text}>Lịch nhóm</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={{
              backgroundColor: "white",
              width: "100%",
              marginVertical: 1,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("CreateGroup", {
                  id: dataConversation?.user?._id,
                });
              }}
              style={styles.item}
            >
              <View style={styles.contentButton}>
                <AntDesign name="addusergroup" size={22} color="#767A7F" />
                <Text style={styles.text}>
                  Tạo nhóm với {dataConversation?.user?.name}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {isGroup ? (
          <View
            style={{
              backgroundColor: "white",
              width: "100%",
              marginVertical: 1,
            }}
          >
            <TouchableOpacity style={styles.item}>
              <View style={styles.contentButton}>
                <AntDesign name="pushpino" size={22} color="#767A7F" />
                <Text style={styles.text}>Tin nhắn đã ghim</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={{
              backgroundColor: "white",
              width: "100%",
              marginVertical: 1,
            }}
          >
            <TouchableOpacity style={styles.item}>
              <View style={styles.contentButton}>
                <SimpleLineIcons name="user-follow" size={22} color="#767A7F" />
                <Text style={styles.text}>
                  Thêm {dataConversation?.user?.name} vào nhóm
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {isGroup ? (
          <View
            style={{
              backgroundColor: "white",
              width: "100%",
              marginVertical: 1,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                // navigation.navigate("ListMemberGroup", { member: dataMember, idGroup: route.params.id});
              }}
              style={styles.item}
            >
              <View style={styles.contentButton}>
                <Feather name="users" size={22} color="#767A7F" />
                <Text style={styles.text}>
                  Xem thành viên ({dataConversation?.members.length})
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={{
              backgroundColor: "white",
              width: "100%",
              marginVertical: 1,
            }}
          >
            <TouchableOpacity style={styles.item}>
              <View style={styles.contentButton}>
                <Feather name="users" size={22} color="#767A7F" />
                <Text style={styles.text}>Xem nhóm chung</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        <View
          style={{ backgroundColor: "white", width: "100%", marginVertical: 1 }}
        >
          <TouchableOpacity style={styles.item}>
            <View style={styles.contentButton}>
              <Entypo name="eye-with-line" size={22} color="#767A7F" />
              <Text style={styles.text}>Ẩn trò chuyện</Text>
            </View>
          </TouchableOpacity>
        </View>

        {isGroup ? (
          <View
            style={{
              backgroundColor: "white",
              width: "100%",
              marginVertical: 2,
            }}
          >
            <TouchableOpacity style={styles.item}>
              <View style={styles.contentButton}>
                <Entypo name="link" size={22} color="#767A7F" />
                <Text style={styles.text}>Link tham gia nhóm</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={{
              backgroundColor: "white",
              width: "100%",
              marginVertical: 2,
            }}
          >
            <TouchableOpacity style={styles.item}>
              <View style={styles.contentButton}>
                <Feather name="phone-incoming" size={22} color="#767A7F" />
                <Text style={styles.text}>Báo cuộc gọi đến</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {isGroup ? (
          <View
            style={{
              backgroundColor: "white",
              width: "100%",
              marginVertical: 2,
            }}
          >
            <TouchableOpacity style={styles.item}>
              <View style={styles.contentButton}>
                <AntDesign name="pushpino" size={24} color="black" />
                <Text style={styles.text}>Ghim trò chuyện</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={{
              backgroundColor: "white",
              width: "100%",
              marginVertical: 2,
            }}
          >
            <TouchableOpacity style={styles.item}>
              <View style={styles.contentButton}>
                <FontAwesome5 name="user-cog" size={22} color="#767A7F" />
                <Text style={styles.text}>Cài đặt cá nhân</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {isGroup ? (
          <View
            style={{
              backgroundColor: "white",
              width: "100%",
              marginVertical: 2,
            }}
          >
            <TouchableOpacity style={styles.item}>
              <View style={styles.contentButton}>
                <FontAwesome5 name="user-cog" size={22} color="#767A7F" />
                <Text style={styles.text}>Cài đặt cá nhân</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={{
              backgroundColor: "white",
              width: "100%",
              marginVertical: 2,
            }}
          >
            <TouchableOpacity style={styles.item}>
              <View style={styles.contentButton}>
                <MaterialCommunityIcons
                  name="message-text-clock-outline"
                  size={22}
                  color="#767A7F"
                />
                <Text style={styles.text}>Tin nhắn tự xóa</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        <View
          style={{ backgroundColor: "white", width: "100%", marginVertical: 2 }}
        >
          <TouchableOpacity style={styles.item}>
            <View style={styles.contentButton}>
              <AntDesign name="warning" size={22} color="#767A7F" />
              <Text style={styles.text}>Báo xấu</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{ backgroundColor: "white", width: "100%", marginVertical: 2 }}
        >
          <TouchableOpacity style={styles.item}>
            <View style={styles.contentButton}>
              <Ionicons name="pie-chart-outline" size={22} color="#767A7F" />
              <Text style={styles.text}>Dung lượng trò chuyện</Text>
            </View>
          </TouchableOpacity>
        </View>
        {isGroup ? (
          <View
            style={{
              backgroundColor: "white",
              width: "100%",
              marginVertical: 2,
            }}
          >
            <TouchableOpacity
              style={styles.item}
              onPress={() => {
                let datasend = {
                  userId: account.id,
                  idGroup: route.params.idGroup,
                };
                outGroup(datasend);
              }}
            >
              <View style={styles.contentButton}>
                <Feather name="log-out" size={22} color="red" />
                <Text style={styles.text}>Rời nhóm</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={{
              backgroundColor: "white",
              width: "100%",
              marginVertical: 2,
            }}
          >
            <TouchableOpacity style={styles.item}>
              <View style={styles.contentButton}>
                <Entypo name="block" size={22} color="#767A7F" />
                <Text style={styles.text}>Quản lý chặn</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
        {isGroup ? (
          <View
            style={{
              backgroundColor: "white",
              width: "100%",
              marginVertical: 2,
            }}
          >
            <TouchableOpacity style={styles.item}>
              <View style={styles.contentButton}>
                <MaterialCommunityIcons
                  name="delete-outline"
                  size={22}
                  color="red"
                />
                <Text style={styles.text}>Xóa lịch sử trò chuyện </Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={{
              backgroundColor: "white",
              width: "100%",
              marginVertical: 2,
            }}
          >
            <TouchableOpacity style={styles.item}>
              <View style={styles.contentButton}>
                <MaterialCommunityIcons
                  name="delete-outline"
                  size={22}
                  color="red"
                />
                <Text style={styles.text}>Xóa lịch sử trò chuyện </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
        {isLeader ? (
          <View
            style={{
              backgroundColor: "white",
              width: "100%",
              marginVertical: 2,
            }}
          >
            <TouchableOpacity
            onPress={GiaiTanNhom}
            style={styles.item}>
              <View style={styles.contentButton}>
                <MaterialCommunityIcons
                  name="delete-outline"
                  size={22}
                  color="red"
                />
                <Text style={styles.text}>Giải tán nhóm </Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E9EBED",
    alignItems: "center",
    gap: 10,
  },
  ViewTop: {
    width: "100%",
    height: 255,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  ViewBottomTop: {
    width: "100%",
    height: 120,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  ViewItemTop: {
    alignItems: "center",
    justifyContent: "center",
    width: "25%",
    gap: 7,
  },
  ViewButtonTop: {
    width: 45,
    height: 45,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F4F5F6",
  },
  FlatListItem: {
    width: "90%",
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  //   touchableOpacity: {
  //     flexDirection: "row",
  //     alignItems: "flex-start",
  //     borderColor: "#DDDDDD",
  //     borderBottomWidth: 1,
  //     width: "100%",
  // },
  item: {
    alignItems: "flex-start",
    marginHorizontal: 14,
    height: 50,
    justifyContent: "center",
  },
  contentButton: {
    gap: 10,
    justifyContent: "center",
    flexDirection: "row",
  },
  text: {
    fontSize: 19,
    color: "black",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "98%",
    marginBottom: 6,
  },
  modalContent: {
    backgroundColor: "white",
    width: "98%",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalOption: {
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    paddingVertical: 10,
  },
  modalText: {
    fontSize: 16,
    color: "#006AF5",
  },
});

export default OptionChat;
