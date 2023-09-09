import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React from "react";

const Forgot = ({ navigation }) => {
  return (
    <View style={{ flex: 1, backgroundColor: "darkslateblue" }}>
      <View
        style={{
          flex: 1,
          backgroundColor: "darkslateblue",
          alignItems: "center",
        }}
      >
        <Image
          source={require("../assets/SoundSync.png")}
          style={{ width: 75, height: 75 }}
        ></Image>
        <Text
          style={{
            margin: 10,
            fontSize: 30,
            color: "white",
            fontStyle: "italic",
          }}
        >
          SoundSync
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          alignContent: "center",
          justifyContent: "center",
          backgroundColor: "white",
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
        }}
      >
        <View style={{ paddingBottom: 10 }}>
          <Text style={{ margin: 10 }}>
            Enter the email address associated with your account and we'll send
            you a link to reset your password.
          </Text>
          <Text style={{ margin: 10 }}>Email Address</Text>
          <TextInput
            style={{
              borderWidth: 1,
              height: 40,
              marginLeft: 10,
              marginRight: 10,
            }}
            placeholder="test14@gmail.com"
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
            onPress={() => navigation.navigate("Login", {})}
          >
            <Text style={{ fontSize: 15, color: "white" }}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          backgroundColor: "white",
        }}
      >
        <Text>Do you have an account?</Text>
        <TouchableOpacity
          style={{ paddingLeft: 2 }}
          onPress={() => navigation.navigate("Create", {})}
        >
          <Text style={{ color: "cornflowerblue" }}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Forgot;
