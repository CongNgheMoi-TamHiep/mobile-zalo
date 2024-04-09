import { createContext, useContext, useEffect, useState } from "react";
import { useCurrentUser } from "../App";
import { useSocket } from "./SocketProvider";
import { Image, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { set } from "date-fns";
import moment from "moment";

import Modal from "react-native-modal";
import axiosPrivate from "../api/axiosPrivate";

export const ShowModelContext = createContext();

const ShowModelProvider = ({ children }) => {
  const [showFriendRequestModelState, setFriendRequestShowModelState] =
    useState(false);
  const [dataFriendRequest, setDataFriendRequest] = useState(null);
  const { socket } = useSocket();
  //modal thông báo đã chấp nhật
  const [showAcceptedModelState, setAcceptedShowModelState] = useState(false);
  const [dataAccepted, setDataAccepted] = useState(null);
  //lắng nghe sự kiện nhận lời mời kết bạn
  useEffect(() => {
    socket.on("receiveFriendRequest", (data) => {
      setDataFriendRequest(data);
    });
    socket.on("acceptFriendRequest", (data) => {
      setDataAccepted(data);
    });
  }, [socket.id]);

  //hiển thị model thông báo lời mời kết bạn
  useEffect(() => {
    if (dataFriendRequest) {
      setFriendRequestShowModelState(true);
      setTimeout(() => {
        setFriendRequestShowModelState(false);
      }, 4000);
    }
    if(dataAccepted){
      setAcceptedShowModelState(true);
      setTimeout(() => {
        setAcceptedShowModelState(false);
      }, 4000);
    }
  }, [dataFriendRequest,dataAccepted]);

  async function ChapNhan(id) {
    try {
      await axiosPrivate.post(`/friendRequest/accept`, { friendRequestId: id });
      setFriendRequestShowModelState(false);
    } catch (error) {
      console.log(error);
    }
  }
  // hàm từ chối lời mời kết bạn
  async function TuChoi(id) {
    try {
      await axiosPrivate.post(`/friendRequest/decline`, {
        friendRequestId: id,
      });
      setFriendRequestShowModelState(false);
    } catch (error) {
      console.log(error);
    }
  }
  //model thông báo lời mời kết bạn
  const FriendRequestModel = ({ data }) => {
    return (
      <Modal
        isVisible={showFriendRequestModelState}
        onBackdropPress={() =>
          setFriendRequestShowModelState(!showFriendRequestModelState)
        }
        style={{ justifyContent: "flex-start", margin: 0 }}
        backdropOpacity={0.65}
        animationIn="slideInDown"
        animationOut="fadeInDown"
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
        hideModalContentWhileAnimating={true}
      >
        <View style={styles.ModalContainer}>
          <Image
            source={{ uri: data.avatar }}
            style={{ width: 62, height: 62, borderRadius: 50 }}
          />
          <View style={{ marginLeft: 10, gap: 8 }}>
            <Text style={{ fontSize: 17, fontWeight: "bold" }}>
              {data.name}{" "}
              <Text style={{ fontSize: 15, color: "#767A7F" }}>
                vừa gửi lời mời kết bạn!
              </Text>
            </Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <TouchableOpacity
                onPress={() => {
                  TuChoi(data._id);
                }}
                style={styles.TuChoi}
              >
                <Text style={{ color: "black", fontSize: 16 }}>Từ chối</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  ChapNhan(data._id);
                }}
                style={styles.ChapNhan}
              >
                <Text style={{ color: "#20B2AA", fontSize: 16 }}>
                  Chấp nhận
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };
  //model thông báo đã chấp nhận lời mời kb
  const AcceptedModel = ({ data }) => {
    return (
      <Modal
        isVisible={showAcceptedModelState}
        onBackdropPress={() =>
          setAcceptedShowModelState(!showAcceptedModelState)
        }
        style={{ justifyContent: "flex-start", margin: 0 }}
        backdropOpacity={0.65}
        animationIn="slideInDown"
        animationOut="fadeInDown"
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
        hideModalContentWhileAnimating={true}
      >
        <View style={styles.ModalContainer}>
          <Image
            source={{ uri: data.avatar }}
            style={{ width: 62, height: 62, borderRadius: 50 }}
          />
          <View style={{ marginLeft: 10, gap: 8 }}>
            <Text style={{ fontSize: 17, fontWeight: "bold" }}>
              {data.name}{" "}
              <Text style={{ fontSize: 15, color: "#767A7F" }}>
               đã chấp nhận lời mời kết bạn!
              </Text>
            </Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <TouchableOpacity
                onPress={() => {
                  // TuChoi(data._id);
                  // how to navigate in conversation page from here
                
                }}
                style={styles.NhanTin}
              >
                <Text style={{ color: "white", fontSize: 16 }}>Nhắn tin</Text>
              </TouchableOpacity>
             
            </View>
          </View>
        </View>
      </Modal>
    );
  };
  return (
    <ShowModelContext.Provider value={{}}>
      {showFriendRequestModelState && (
        <FriendRequestModel data={dataFriendRequest} />
      )}
      {showAcceptedModelState && (<AcceptedModel data={dataAccepted} />)}
      {children}
    </ShowModelContext.Provider>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D6D9DC",
  },
  ModalContainer: {
    backgroundColor: "white",
    padding: 12,
    gap: 12,
    flexDirection: "row",
  },
  TuChoi: {
    backgroundColor: "#E0E0E0",
    width: 110,
    height: 32,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  NhanTin: {
    backgroundColor: "#006AF5",
    width: 110,
    height: 32,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  ChapNhan: {
    marginLeft: 12,
    backgroundColor: "#F0F9FC",
    width: 110,
    height: 32,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ShowModelProvider;
export const useShowModel = () => useContext(ShowModelContext);
