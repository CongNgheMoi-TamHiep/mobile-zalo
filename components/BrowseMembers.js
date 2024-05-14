import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Switch,FlatList,Image, TouchableOpacity } from "react-native";
import axiosPrivate from "../api/axiosPrivate";

export default function ViewMember({ navigation, route }) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [dataConversation, setDataConversation] = useState([]);
 async function fetchDataWaitList(){
    const response = await axiosPrivate.get(`/group/${route.params?.dataConversation._id}`);
    console.log("dataConversation", response);
    setIsEnabled(response.memberModeration);
    setDataConversation(response);
  }
  useEffect(() => {
    fetchDataWaitList()
  }, []);
  const toggleSwitch = async () => {
    setIsEnabled((previousState) => !previousState);
    try {
        const response = await axiosPrivate.patch(`/group/updateInfo/${route.params?.dataConversation?._id}`,{
            memberModeration:   !isEnabled
        });
        console.log("object",response)
      } catch (error) {
        console.error(":", error);
      }
  };
    async function ChapNhan(id){
       try {
        const res = await axiosPrivate.post(`/group/addMember/${dataConversation._id}`, {
            userId: id
        });
        fetchDataWaitList()
    }
        catch (error) {
            console.error("Lỗi khi chấp nhận", error);
          }
     
  }
  return (
    <View style={styles.container}>
      <View
        style={{ height: '17%', backgroundColor: "#fff", padding: 10, gap: 7 }}
      >
        <Text style={{ fontSize: 18, color: "#0250B6", fontWeight: "500" }}>
          Cài đặt chung
        </Text>
        <View style={{ flexDirection: "row", width: "100%", height: 80 }}>
          <View style={{ width: "80%", height: 70 }}>
            <Text style={{ fontSize: 18, fontWeight: 500 }}>
              Duyệt thành viên
            </Text>
            <Text style={{ fontSize: 17, fontWeight: 500, color: "#767A7F" }}>
              Khi bật, yêu cầu tham gia phải được duyệt bởi trưởng hoặc phó nhóm
            </Text>
          </View>
          <View style={{ justifyContent: "center",width: "18%" }}>
            <Switch
              trackColor={{ false: "#767577", true: "#52A0FF" }}
              thumbColor={isEnabled ? "#006AF5" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
        </View>
      </View>
      <View style={{width:'100%',padding:10,height:'82%',backgroundColor:'#fff'}}>
        <Text style={{fontSize: 18, color: "#0250B6", fontWeight: "500"}}>Danh sách chờ ({dataConversation?.waitingList?.length})</Text>
        <FlatList
            data={dataConversation?.waitingList}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={{ flexDirection: "row", padding: 10 }}>
                    <Image
                    style={{width: 50, height: 50, borderRadius: 50}}
                    source={{uri: item.avatar}}
                    />
                    <View style={{marginLeft: 10,gap:4}}>
                        <Text style={{fontSize: 18, fontWeight: '500'}}>{item.name}</Text>
                        <Text style={{fontSize: 17, color: '#767A7F'}}>Được thêm bởi  
                        <Text style={{color:'black', fontWeight:500}}>
                        {" "} {item.userAdded.name}
                        </Text>
                       </Text>
                       <View style={{flexDirection:'row',gap:15}}>
                            <TouchableOpacity style={{width: 110,justifyContent:'center',alignItems:'center',height:34,borderRadius:15,backgroundColor:'#E9EBED'}}>
                                <Text style={{color:'#141415',fontWeight:500,fontSize:18}}>Từ chối</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                            onPress={()=>{
                                ChapNhan(item._id)
                            }}
                            style={{width: 110,justifyContent:'center',alignItems:'center',height:34,borderRadius:15,backgroundColor:'#52A0FF'}}>
                                <Text style={{color:'#fff',fontWeight:500,fontSize:18}}>Chấp nhận</Text>
                            </TouchableOpacity>
                       </View>
                    </View>
              </View>
            )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D6D9DC",
    gap:10
  },
});
