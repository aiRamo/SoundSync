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
    if (option === "Settings") {
      navigation.navigate("Profile", {});
    } else if (option === "Sign Out") {
      handleSignOut();
    }
    setDropdownVisible(false);
  };

  return (
    <View
      style={{
        backgroundColor: "darkslateblue",
        height: "8%",
      }}
    >
      <View
        style={{
          marginTop: StatusBar.currentHeight,
          flexDirection: "row",
          justifyContent: "flex-end",
        }}
      >
        <TouchableOpacity
          style={{ marginBottom: 10, top: "1.6%", right: "60%" }}
          onPress={toggleDropdown}
        >
          <Entypo name="dots-three-vertical" size={24} color="white" />
        </TouchableOpacity>
        <Drop
          isVisible={isDropdownVisible}
          options={["Settings", "Sign Out", "Close"]}
          onSelect={handleDropdownSelect}
          onClose={() => setDropdownVisible(false)}
        />
      </View>
    </View>
  );
};

export default Header;
