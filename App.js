import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./screens/Home";
import Scan from "./screens/Scan";
import AudioRecorder from "./screens/Audio";
import Login from "./screens/Login";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: "Home" }}
        />
        <Stack.Screen name="Scan" component={Scan} />
        <Stack.Screen name="Audio" component={AudioRecorder} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
