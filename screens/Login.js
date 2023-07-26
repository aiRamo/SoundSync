import { View, Text, Button, TextInput, TouchableOpacity } from "react-native";
import React from "react";

const Login = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{ flex: 1, alignContent: "center", justifyContent: "center" }}
      >
        <View style={{ paddingBottom: 10 }}>
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
          <Text style={{ margin: 10 }}>Password</Text>
          <TextInput
            style={{
              borderWidth: 1,
              height: 40,
              marginLeft: 10,
              marginRight: 10,
            }}
            placeholder="*****"
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
            onPress={() => navigation.navigate("Home", {})}
          >
            <Text style={{ fontSize: 15, color: "white" }}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ alignItems: "center", paddingTop: 5 }}>
            <Text style={{ color: "cornflowerblue" }}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Text>Do you have an account?</Text>
        <TouchableOpacity style={{ paddingLeft: 2 }}>
          <Text style={{ color: "cornflowerblue" }}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;
