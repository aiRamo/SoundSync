import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
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
    <View style={{ flex: 1, backgroundColor: "#d6d6e6" }}>
      <Header style navigation={navigation} />

      <View
        style={{
          alignItems: "center",
          backgroundColor: "white",
          marginLeft: 50,
          marginRight: 50,
          marginTop: 50,
          borderRadius: 20,
          flex: 0.9,
        }}
      >
        {image == require("../assets/addScan.png") && (
          <Image source={image} style={{ resizeMode: "contain" }} />
        )}
        {image != require("../assets/addScan.png") && (
          <Image
            source={{ uri: image }}
            style={{ resizeMode: "contain", height: "100%", width: "100%" }}
          />
        )}
      </View>

      <TouchableOpacity
        style={{
          borderRadius: 5,
          backgroundColor: "darkslateblue",
          padding: 10,
          marginLeft: 50,
          marginRight: 50,
          marginTop: 10,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white" }}>Highlight Notes</Text>
      </TouchableOpacity>
    </View>
  );
}
