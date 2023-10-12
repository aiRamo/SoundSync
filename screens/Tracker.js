import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Button,
} from "react-native";
import Header from "../components/UI/header";
import React from "react";
import { useDataContext } from "../components/DataContext";

export default function Tracker({ navigation }) {
  const { data } = useDataContext();

  console.log(data);

  return (
    <View style={{ flex: 1 }}>
      <Header style navigation={navigation} />
      <TouchableOpacity
        style={{
          borderRadius: 5,
          backgroundColor: "red",
          padding: 10,
          marginLeft: 10,
          marginRight: 10,
          marginTop: 10,
          alignItems: "center",
        }}
      >
        <Text>Highlight Notes</Text>
      </TouchableOpacity>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          style={{ resizeMode: "contain", height: "100%", width: "100%" }}
          source={require("../assets/test.png")}
        />
      </View>
    </View>
  );
}
