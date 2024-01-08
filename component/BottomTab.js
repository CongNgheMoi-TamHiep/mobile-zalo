import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AntDesign, SimpleLineIcons, FontAwesome5, MaterialCommunityIcons, Feather, Entypo, Ionicons} from '@expo/vector-icons';
import Messages from "./Messages";
import Contacts from "./Contacts";
import Discovery from "./Discovery";
import Timeline from "./Timeline";
import User from "./User";
import { View, TextInput } from "react-native";

const Tab = createBottomTabNavigator();

export default function MyTabs() {
    // Define your custom header components
    const renderSearchIcon = () => (
        <View style={{ flexDirection: 'row', height: 30 }}>
            <Feather name="search" size={28} color="white" />
            <View style={{ marginLeft: 20 }} />
            <TextInput
                placeholder="search"
                placeholderTextColor={"white"}
                style={{ fontWeight: 'bold', fontSize: 18, width: 215, height: 28, color: 'white' }}
            />
        </View>


    );
    const renderQRIcon = () => (
        <MaterialCommunityIcons name="qrcode-scan" size={24} color="white"/>
    );
    const renderPlusIcon = () => (
        <Feather name="plus" size={34} color="white" />
    );
    const renderAddUserIcon = () => (
        <Entypo name="add-user" size={24} color="white" />
    );
    const renderNoteIcon = () => (
        <SimpleLineIcons name="note" size={24} color="white" />
    );
    const renderBellIcon = () => (
        <SimpleLineIcons name="bell" size={24} color="white" />
    );
    const renderSettingIcon = () => (
        <Ionicons name="settings-outline" size={24} color="white" />
    );

    return (
        <Tab.Navigator>
            <Tab.Screen
                name="Messages"
                component={Messages}
                options={{
                    headerTitle: "",
                    headerRight: () => (
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
                            {renderQRIcon()}
                            <View style={{ marginRight: 20 }} />
                            {renderPlusIcon()}
                        </View>
                    ),
                    headerLeft: () => (
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
                            <View style={{ marginLeft: 20 }} />
                            {renderSearchIcon()}
                        </View>
                    ),
                    headerStyle: {
                        backgroundColor: '#0895FB',
                    },
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="message1" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Contacts"
                component={Contacts}
                options={{
                    headerTitle: "",
                    headerRight: () => (
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
                            {renderAddUserIcon()}
                        </View>
                    ),
                    headerLeft: () => (
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
                            <View style={{ marginLeft: 20 }} />
                            {renderSearchIcon()}
                        </View>
                    ),
                    headerStyle: {
                        backgroundColor: '#0895FB',
                    },
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="contacts" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Discovery"
                component={Discovery}
                options={{
                    headerTitle: "",
                    headerRight: () => (
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
                            {renderQRIcon()}
                        </View>
                    ),
                    headerLeft: () => (
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
                            <View style={{ marginLeft: 20 }} />
                            {renderSearchIcon()}
                        </View>
                    ),
                    headerStyle: {
                        backgroundColor: '#0895FB',
                    },
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="appstore-o" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Timeline"
                component={Timeline}
                options={{
                    headerTitle: "",
                    headerRight: () => (
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
                            {renderNoteIcon()}
                            <View style={{ marginRight: 20 }} />
                            {renderBellIcon()}
                        </View>
                    ),
                    headerLeft: () => (
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
                            <View style={{ marginLeft: 20 }} />
                            {renderSearchIcon()}
                        </View>
                    ),
                    headerStyle: {
                        backgroundColor: '#0895FB',
                    },
                    tabBarIcon: ({ color, size }) => (
                        <SimpleLineIcons name="clock" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="User"
                component={User}
                options={{
                    headerTitle: "",
                    headerRight: () => (
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
                            {renderSettingIcon()}
                        </View>
                    ),
                    headerLeft: () => (
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
                            <View style={{ marginLeft: 20 }} />
                            {renderSearchIcon()}
                        </View>
                    ),
                    headerStyle: {
                        backgroundColor: '#0895FB',
                    },
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome5 name="user" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}