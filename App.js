import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home';
import Scan from './screens/Scan';
import Audio from './screens/Audio';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
        name = "Home" 
        component={Home}
        options={{title:'Home'}}
        />
        <Stack.Screen name="Scan" component={Scan}/>
        <Stack.Screen name="Audio" component={Audio}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

