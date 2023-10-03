import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React from "react";

export default function Card({ imgeUrl, title, date, navigation }) {
  return (
    <View style={styles.container2}>
      {imgeUrl ? (
        <Image
          source={{ uri: imgeUrl }}
          style={{ width: 200, height: 75, resizeMode: "contain" }}
        />
      ) : (
        <Text>Loading image...</Text>
      )}
      <View style={{ flexDirection: "column", alignItems: "center" }}>
        <Text>{title}</Text>
        <Text style={{ fontSize: 8.5 }}>{date}</Text>
      </View>

      <TouchableOpacity
        style={styles.touching}
        onPress={() =>
          navigation.navigate("Home", { screen: "Scan", params: { imgeUrl } })
        }
      >
        <Text style={{ fontSize: 15, color: "white" }}>Load</Text>
      </TouchableOpacity>
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
