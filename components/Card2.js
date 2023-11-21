import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";

import { Entypo } from "@expo/vector-icons";
import React from "react";

export default function Card2({
  title,
  handleSubfolderSelection,
  handleDelete,
}) {
  return (
    <View>
      <View
        style={{
          borderBottomWidth: 1,
          marginBottom: 10,
          borderBottomColor: "darkslateblue",
        }}
      >
        <View style={styles.container2}>
          <Entypo name="folder" size={24} color="darkslateblue" />
          <Text style={{ marginLeft: 10 }}>{title}</Text>
          <View
            style={{
              flexDirection: "row",
              flex: 1,
              justifyContent: "flex-end",
              marginRight: 20,
            }}
          >
            <TouchableOpacity
              style={{
                marginLeft: 20,
                backgroundColor: "darkslateblue",

                borderRadius: 10,
                borderWidth: 1,
                padding: 5,
              }}
              onPress={handleSubfolderSelection}
            >
              <Text style={{ color: "white" }}>Select</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                marginLeft: 20,
                backgroundColor: "red",
                borderRadius: 10,
                borderWidth: 1,
                padding: 5,
              }}
              onPress={handleDelete}
            >
              <Text style={{ color: "white" }}>Delete</Text>
            </TouchableOpacity>
          </View>
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
