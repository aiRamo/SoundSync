import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Button,
} from "react-native";
import Header from "../components/UI/header";
import React, { useState, useEffect } from "react";
import { useDataContext } from "../components/DataContext";
import { useDataContext2 } from "../components/DataContext2";

export default function Tracker({ navigation }) {
  const { data1 } = useDataContext();
  const { data2 } = useDataContext2();
  const [image, setImage] = useState(require("../assets/addScan.png"));

  console.log(data1);
  console.log(data2);

  useEffect(() => {
    if (data2 != "") {
      setImage(data2);
    }
  }, [data2]);

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
        {image != require("../assets/addScan.png") && (
          <Image
            source={{ uri: image }}
            style={{ resizeMode: "contain", height: "100%", width: "100%" }}
          />
        )}
      </View>
    </View>
  );
}
