import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Profile = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{ flex: 1, alignContent: "center", justifyContent: "center" }}
      >
        <View style={{ paddingBottom: 10 }}>
          <Text style={{ margin: 10, fontSize: 30 }}>Fill Your Profile</Text>
          <View style={{ alignItems: "center" }}>
            <MaterialCommunityIcons
              name="face-man-profile"
              size={200}
              color="black"
            />
          </View>

          <TextInput
            style={{
              borderWidth: 1,
              height: 40,
              margin: 10,
            }}
            placeholder="Full Name"
          />
          <TextInput
            style={{
              borderWidth: 1,
              height: 40,
              marginBottom: 10,
              marginLeft: 10,
              marginRight: 10,
            }}
            placeholder="email"
          />
          <TextInput
            style={{
              borderWidth: 1,
              height: 40,
              marginLeft: 10,
              marginRight: 10,
            }}
            placeholder="Phone number"
          />
        </View>
        <View style={{ marginLeft: 10, marginRight: 10 }}>
          <TouchableOpacity
            style={{
              borderRadius: 5,
              backgroundColor: "darkslateblue",
              padding: 10,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 15, color: "white" }}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Profile;
