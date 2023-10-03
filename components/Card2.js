import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";

import { Entypo } from "@expo/vector-icons";
import React from "react";

export default function Card2({ title }) {
  return (
    <View>
      <View style={{ borderWidth: 1, marginBottom: 10 }}>
        <View style={styles.container2}>
          <Entypo name="folder" size={24} color="darkslateblue" />
          <Text style={{ marginLeft: 10 }}>{title}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container2: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "black",
    marginBottom: 10,
    marginTop: 10,
  },
});
