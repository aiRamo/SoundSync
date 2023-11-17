import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, FontAwesome, AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { AUTH } from "./firebaseConfig";
import Scan from "./screens/Scan";
import AudioRecorder from "./screens/Audio";
import Login from "./screens/Login";
import Create from "./screens/Create";
import Forgot from "./screens/Forgot";
import Profile from "./screens/Profile";
import Library from "./screens/Library";
import Folder from "./screens/Folder";
import Tracker from "./screens/Tracker";
import Test from "./screens/Test";
import Header from "./components/UI/header";
import { View, TouchableOpacity } from "react-native";

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
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "rgba(72,61,139,0)",
          borderBottomWidth: 0,
          borderColor: "rgba(0,0,0,0.5)",
          top: "-0.75vh",
          left: "1vw",
          height: "6vh",
          width: "98vw",
          alignSelf: "center",
          paddingTop: 10,
          paddingHorizontal: 300,
        },
      }}
    >
      <Tab.Screen
        name="Scan"
        component={Scan}
        options={{
          title: "Scan",
          tabBarIcon: ({ focused }) => (
            <>
              <Ionicons
                name="scan"
                size={24}
                color={focused ? "white" : "grey"}
                style={{ zIndex: 2 }}
              />
              <View
                style={{
                  position: "absolute",
                  width: 100,
                  height: 50,
                  borderWidth: focused ? 2 : 0,
                  borderColor: "rgba(91, 85, 147, 1)", // Set the border color
                  backgroundColor: focused
                    ? "rgba(91, 85, 147, 1)"
                    : "rgba(91, 85, 147, 0)",
                  borderRadius: 20,
                  left: "-1vw",
                  zIndex: -1,
                }}
              />
            </>
          ),
          tabBarActiveTintColor: "#ffffff",
          tabBarLabelStyle: {
            fontWeight: "bold", // Set the font weight for tab titles
            zIndex: 2,
          },
        }}
      ></Tab.Screen>
      <Tab.Screen
        name="Folder"
        component={Folder}
        options={{
          title: "Library",
          tabBarIcon: ({ focused }) => (
            <>
              <AntDesign
                name="profile"
                size={24}
                color={focused ? "white" : "grey"}
                style={{ zIndex: 2 }}
              />
              <View
                style={{
                  position: "absolute",
                  width: 100,
                  height: 50,
                  borderWidth: focused ? 2 : 0,
                  borderColor: "rgba(91, 85, 147, 1)", // Set the border color
                  backgroundColor: focused
                    ? "rgba(91, 85, 147, 1)"
                    : "rgba(91, 85, 147, 0)",
                  borderRadius: 20,
                  left: "-0.7vw",
                  zIndex: -1,
                }}
              />
            </>
          ),
          tabBarActiveTintColor: "#ffffff",
          tabBarLabelStyle: {
            fontWeight: "bold", // Set the font weight for tab titles
            zIndex: 2,
          },
        }}
      ></Tab.Screen>
      <Tab.Screen
        name="Test"
        component={Test}
        options={{
          title: "Test",
          tabBarIcon: ({ focused }) => (
            <>
              <MaterialIcons
                name="multitrack-audio"
                size={24}
                color={focused ? "white" : "grey"}
                style={{ zIndex: 2 }}
              />
              <View
                style={{
                  position: "absolute",
                  width: 100,
                  height: 50,
                  borderWidth: focused ? 2 : 0,
                  borderColor: "rgba(91, 85, 147, 1)", // Set the border color
                  backgroundColor: focused
                    ? "rgba(91, 85, 147, 1)"
                    : "rgba(91, 85, 147, 0)",
                  borderRadius: 20,
                  left: "-1vw",
                  zIndex: -1,
                }}
              />
            </>
          ),
          tabBarActiveTintColor: "#ffffff",
          tabBarLabelStyle: {
            fontWeight: "bold", // Set the font weight for tab titles
            zIndex: 2,
          },
        }}
      ></Tab.Screen>

      <Tab.Screen
        name="Header"
        component={() => null} // Empty component, as it won't be used
        options={{
          tabBarButton: ({ navigation }) => <Header navigation={navigation} />,
          tabBarIcon: () => null, // No icon for this tab
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = AUTH.onAuthStateChanged((user) => {
      setIsAuthChecked(true);
      setIsUserLoggedIn(!!user); // true if user is non-null, false otherwise
    });

    // Cleanup the listener when the component is destroyed
    return unsubscribe;
  }, []);

  if (!isAuthChecked) {
    return null; // Optionally return a loading spinner or some other placeholder
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          headerStyle: { backgroundColor: "darkslateblue" },
          headerTintColor: "white",
        }}
      >
        {isUserLoggedIn ? (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: "SoundSync", headerShown: false }}
            />
            <Stack.Screen
              name="Tracker"
              component={Tracker}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <>
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
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
