import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import { AUTH } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState("");

  const signIn = async () => {
    setLoading(true);

    try {
      const response = await signInWithEmailAndPassword(
        AUTH,
        email.trim(),
        password
      );

      navigation.navigate("Home", {});
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "darkslateblue",
        alignContent: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          flex: 0.5,
          backgroundColor: "#d6d6e6",
          alignContent: "center",
          justifyContent: "center",
          marginLeft: 300,
          marginRight: 300,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
        }}
      >
        <View style={{ paddingBottom: 10, marginTop: 80 }}>
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
            onPress={() => signIn()}
          >
            <Text style={{ fontSize: 15, color: "white" }}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ alignItems: "center", paddingTop: 5 }}
            onPress={() => navigation.navigate("Forgot", {})}
          >
            <Text style={{ color: "cornflowerblue" }}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            backgroundColor: "#d6d6e6",

            borderBottomLeftRadius: 15,
            borderBottomRightRadius: 15,
          }}
        >
          <Text>Do you have an account?</Text>
          <TouchableOpacity
            style={{ paddingLeft: 2, marginBottom: 25 }}
            onPress={() => navigation.navigate("Create", {})}
          >
            <Text style={{ color: "cornflowerblue" }}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Login;
