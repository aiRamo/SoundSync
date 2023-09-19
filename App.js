import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, FontAwesome, AntDesign } from "@expo/vector-icons";
import Home from "./screens/Home";
import Scan from "./screens/Scan";
import AudioRecorder from "./screens/Audio";
import Login from "./screens/Login";
import Create from "./screens/Create";
import Forgot from "./screens/Forgot";
import Profile from "./screens/Profile";
import { WaveMeter } from "./components/UI/scannerLoader";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const headerStyle = {
  backgroundColor: "darkslateblue", // Change this to your desired background color
};

function HomeScreen() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: { position: "absolute", backgroundColor: "darkslateblue" },
      }}
    >
      <Tab.Screen
        name="Scan"
        component={Scan}
        options={{
          title: "Scan Page",
          tabBarIcon: ({}) => <Ionicons name="scan" size={24} color="white" />,
          tabBarActiveTintColor: "white",
        }}
      ></Tab.Screen>
      <Tab.Screen
        name="Audio"
        component={AudioRecorder}
        options={{
          title: "Audio Page",
          tabBarIcon: ({}) => (
            <FontAwesome name="file-audio-o" size={24} color="white" />
          ),
          tabBarActiveTintColor: "white",
        }}
      ></Tab.Screen>
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          title: "Profile Page",
          tabBarIcon: ({}) => (
            <AntDesign name="profile" size={24} color="white" />
          ),
          tabBarActiveTintColor: "white",
        }}
      ></Tab.Screen>
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          headerStyle: { backgroundColor: "darkslateblue" },
          headerTintColor: "white",
        }}
      >
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerStyle }}
        />
        <Stack.Screen
          name="Create"
          component={Create}
          options={{ headerStyle }}
        />
        <Stack.Screen
          name="Forgot"
          component={Forgot}
          options={{ headerStyle }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "SoundSync" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
