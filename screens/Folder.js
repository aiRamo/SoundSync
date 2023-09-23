import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { STORAGE } from "../firebaseConfig";
import Card2 from "../components/Card2";
import { Entypo, AntDesign } from "@expo/vector-icons";
import Drop from "../components/Drop";
import { AUTH } from "../firebaseConfig";
import { useNavigation } from "@react-navigation/native";

export default function Library() {
  const navigation = useNavigation();

  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [subfolders, setSubfolders] = useState([]);

  useEffect(() => {
    // Check for user authentication status on component mount
    const unsubscribe = AUTH.onAuthStateChanged((authUser) => {
      if (authUser) {
        // User is signed in
        setUser(authUser);
      } else {
        // User is signed out
        setUser(null);
      }
    });

    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Load subfolders in the root folder initially
    if (user) {
      listSubfolders(`images/${user.uid}/sheetCollections/`);
    }
  }, [user]);

  // Function to list subfolders within a folder
  async function listSubfolders(folderPath) {
    const folderRef = ref(STORAGE, folderPath);
    const listResult = await listAll(folderRef);

    const subfolders = listResult.prefixes.map((prefix) => prefix.name);
    setSubfolders(subfolders);
  }

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const handleDropdownSelect = (option) => {
    // Handle the selected option here
    if (option === "Settings") {
      navigation.navigate("Profile", {});
      // Handle the "Settings" action here
    } else if (option === "Sign Out") {
      handleSignOut();
      // Handle the "Sign Out" action here
    }

    // Close the dropdown
    setDropdownVisible(false);
  };

  const handleSignOut = async () => {
    try {
      await AUTH.signOut();
      navigation.navigate("Login", {});
      // Redirect or perform any other action after signing out.
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Function to handle subfolder selection
  const handleSubfolderSelection = (subfolderName) => {
    // Navigate to the SubfolderScreen with the selected subfolder name
    navigation.navigate("Library", { subfolderName });
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          backgroundColor: "darkslateblue",
        }}
      >
        <View
          style={{
            marginTop: StatusBar.currentHeight,
            justifyContent: "flex-end",
            alignItems: "flex-end",
            marginBottom: 5,
          }}
        >
          <TouchableOpacity onPress={toggleDropdown}>
            <Entypo name="dots-three-vertical" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.container}>
        <View style={{ marginBottom: 10, flexDirection: "row" }}>
          <Drop
            isVisible={isDropdownVisible}
            options={["Settings", "Sign Out", "Close"]}
            onSelect={handleDropdownSelect}
            onClose={() => setDropdownVisible(false)}
          />
        </View>
        <ScrollView>
          <Text style={{ borderBottomWidth: 1, marginBottom: 5 }}>Folders</Text>
          {subfolders.map((subfolderName, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleSubfolderSelection(subfolderName)}
            >
              <Card2 title={subfolderName} date="" />
              {/* You can customize the Card component to display subfolders */}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  search: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    borderColor: "white",
    color: "white",
    marginBottom: 5,
    marginLeft: 10,
  },
});
