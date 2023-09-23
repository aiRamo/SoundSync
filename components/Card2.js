import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import React from "react";

export default function Card2({ title }) {
  return (
    <View style={styles.container2}>
      <AntDesign name="folder1" size={24} color="black" />
      <View style={{ flexDirection: "column", alignItems: "center" }}></View>

      <Text style={{ marginLeft: 10 }}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container2: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "black",
    borderWidth: 1,
    marginBottom: 10,
  },
  touching: {
    marginLeft: 10,
    borderRadius: 5,
    backgroundColor: "darkslateblue",
    padding: 10,
    alignItems: "center",
  },
});
