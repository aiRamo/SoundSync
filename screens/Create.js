import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { AUTH, FIREBASE } from "../firebaseConfig";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const Create = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState("");

  const signUp = async () => {
    try {
      const response = await createUserWithEmailAndPassword(
        AUTH,
        email.trim(),
        password
      );
      alert("Account created succesfully");
      navigation.navigate("Home", {});
    } catch (error) {
      console.log(error);
      alert("Registration failed " + error.message);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{ flex: 1, alignContent: "center", justifyContent: "center" }}
      >
        <View style={{ paddingBottom: 10 }}>
          <Text style={{ margin: 10, fontSize: 30 }}>SoundSync</Text>
          <Text style={{ margin: 10 }}>Email Address</Text>
          <TextInput
            style={{
              borderWidth: 1,
              height: 40,
              marginLeft: 10,
              marginRight: 10,
            }}
            value={email}
            placeholder="test14@gmail.com"
            onChangeText={(text) => setEmail(text)}
          />
          <Text style={{ margin: 10 }}>Password</Text>
          <TextInput
            style={{
              borderWidth: 1,
              height: 40,
              marginLeft: 10,
              marginRight: 10,
            }}
            secureTextEntry={true}
            value={password}
            placeholder="*****"
            onChangeText={(text) => setPassword(text)}
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
            //onPress={() => navigation.navigate("Home", {})}
            onPress={() => signUp()}
          >
            <Text style={{ fontSize: 15, color: "white" }}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Text>Already have an account?</Text>
        <TouchableOpacity
          style={{ paddingLeft: 2 }}
          onPress={() => navigation.navigate("Login", {})}
        >
          <Text style={{ color: "cornflowerblue" }}>Login Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Create;
