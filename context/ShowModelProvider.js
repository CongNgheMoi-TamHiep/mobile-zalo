import { createContext, useContext, useEffect, useState } from "react";
import { useCurrentUser } from "../App";
import { useSocket } from "./SocketProvider";
import { Image, Text, View, TouchableOpacity } from "react-native";
import { set } from "date-fns";
import moment from "moment";

import Modal from "react-native-modal";

export const ShowModelContext = createContext();

const ShowModelProvider = ({ children }) => {
  const [showFriendRequestModelState, setFriendRequestShowModelState] =
    useState(false);
  const [dataFriendRequest, setDataFriendRequest] = useState(null);
  const { socket } = useSocket();

  //lắng nghe sự kiện nhận lời mời kết bạn
  useEffect(() => {
    socket.on("receiveFriendRequest", (data) => {
      setDataFriendRequest(data);
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
  }, [dataFriendRequest]);
  function covertTime(time) {
    const currentDateTime = moment();
    const duration = moment.duration(currentDateTime.diff(time));

    if (duration.asMinutes() < 60) {
      return `${Math.round(duration.asMinutes())} phút trước`;
    } else if (duration.asHours() < 24) {
      return `${Math.round(duration.asHours())} giờ trước`;
    } else {
      return `${Math.round(duration.asDays())} ngày trước`;
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
        <View
          style={{
            backgroundColor: "white",
            padding: 12,
            gap: 12,
            flexDirection: "row",
          }}
        >
          <Image
            source={{ uri: data.avatar }}
            style={{ width: 62, height: 62, borderRadius: 50 }}
          />
          <View style={{ marginLeft: 10, gap: 8 }}>
            <Text style={{ fontSize: 17, fontWeight: "bold" }}>
              {data.name} <Text >vừa gửi lời mời kết bạn!</Text> 
            </Text>
            
            <View style={{ flexDirection: "row", gap: 8 }}>
              <TouchableOpacity
                onPress={() => {
                  //   TuChoi(data._id)
                }}
                style={{
                  backgroundColor: "#E0E0E0",
                  width: 110,
                  height: 32,
                  borderRadius: 15,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "black", fontSize: 16 }}>Từ chối</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  //   ChapNhan(data._id)
                }}
                style={{
                  backgroundColor: "#F0F9FC",
                  width: 110,
                  height: 32,
                  borderRadius: 15,
                  justifyContent: "center",
                  alignItems: "center",
                }}
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
  return (
    <ShowModelContext.Provider value={{}}>
      {showFriendRequestModelState && (
        <FriendRequestModel data={dataFriendRequest} />
      )}
      {children}
    </ShowModelContext.Provider>
  );
};

export default ShowModelProvider;
export const useShowModel = () => useContext(ShowModelContext);
