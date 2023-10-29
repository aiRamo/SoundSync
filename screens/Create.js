import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import { AUTH, FIREBASE, DB } from "../firebaseConfig";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";

const Create = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState("");

  const signUp = async () => {
    if (password === password2) {
      try {
        const response = await createUserWithEmailAndPassword(
          AUTH,
          email.trim(),
          password
        );
        const docRef = await addDoc(collection(DB, "users"), {
          name: email.trim(),
        });
        alert("Account created succesfully");

        navigation.navigate("Home", {});
      } catch (error) {
        console.log(error);
        alert("Registration failed " + error.message);
      }
    } else {
      alert("Passwords do not match");
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "darkslateblue",
        alignContent: "center",
        justifyContent: "center",
        backgroundColor: "darkslateblue",
      }}
    >
      <View
        style={{
          flex: 0.5,
          alignContent: "center",
          justifyContent: "center",
          backgroundColor: "#d6d6e6",
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          marginLeft: 300,
          marginRight: 300,
        }}
      >
        <View
          style={{
            paddingBottom: 10,
            marginTop: 80,
          }}
        >
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
          <Text style={{ margin: 10 }}> Confirm Password</Text>
          <TextInput
            style={{
              borderWidth: 1,
              height: 40,
              marginLeft: 10,
              marginRight: 10,
            }}
            secureTextEntry={true}
            value={password2}
            placeholder="*****"
            onChangeText={(text) => setPassword2(text)}
          />
        </View>
        <View
          style={{
            backgroundColor: "#d6d6e6",
          }}
        >
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
              <Text style={{ fontSize: 15, color: "white" }}>
                Create Account
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            backgroundColor: "#d6d6e6",
            paddingBottom: 5,
            paddingTop: 20,
            borderBottomEndRadius: 15,
            borderBottomLeftRadius: 15,
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
    </View>
  );
};

export default Create;
