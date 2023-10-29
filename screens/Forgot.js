import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { AUTH } from "../firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";
import React, { useState, useEffect } from "react";

const Forgot = ({ navigation }) => {
  const [email, setEmail] = useState("");

  const handlePasswordReset = () => {
    const realEmail = email.trim();
    if (realEmail) {
      sendPasswordResetEmail(AUTH, realEmail)
        .then(() => {
          // Password reset email sent successfully

          Alert.alert(
            "Password Reset",
            "Password reset email sent. Please check your inbox and follow the instructions."
          );

          navigation.navigate("Login"); // Navigate back to the login screen
        })
        .catch((error) => {
          Alert.alert("Password Reset Error", error.message);
        });
    } else {
      Alert.alert("Input Error", "Please enter your email address.");
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "darkslateblue",
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      <View
        style={{
          flex: 0.5,
          alignContent: "center",
          justifyContent: "center",
          backgroundColor: "#d6d6e6",
          marginLeft: 300,
          marginRight: 300,
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
            value={email}
            onChangeText={(text) => setEmail(text)}
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
            onPress={handlePasswordReset}
            // onPress={() => navigation.navigate("Login", {})}
          >
            <Text style={{ fontSize: 15, color: "white" }}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          backgroundColor: "#d6d6e6",
          marginLeft: 300,
          marginRight: 300,
          borderBottomLeftRadius: 15,
          borderBottomRightRadius: 15,
          paddingBottom: 5,
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
