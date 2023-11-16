import React, { useState } from "react";
import { View, TouchableOpacity, StatusBar } from "react-native";
import { Entypo } from "@expo/vector-icons";
import Drop from "../Drop";
import { AUTH } from "../../firebaseConfig";

const Header = ({ navigation }) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const handleSignOut = async () => {
    try {
      await AUTH.signOut();
      navigation.navigate("Login", {});
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const handleDropdownSelect = (option) => {
    if (option === "Sign Out") {
      handleSignOut();
    }
    setDropdownVisible(false);
  };

  return (
    <View
      style={{
        position: "absolute",
        flexDirection: "row",
        alignItems: "center",
        right: -325,
        marginRight: 25,
        marginTop: 10,
      }}
    >
      <TouchableOpacity onPress={toggleDropdown}>
        <Entypo name="dots-three-vertical" size={24} color="#5B5593" />
      </TouchableOpacity>
      <Drop
        isVisible={isDropdownVisible}
        options={["Sign Out", "Close"]}
        onSelect={handleDropdownSelect}
        onClose={() => setDropdownVisible(false)}
      />
    </View>
  );
};

export default Header;
