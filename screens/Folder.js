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
import Header from "../components/UI/header";
import { AUTH } from "../firebaseConfig";
import { useNavigation } from "@react-navigation/native";

export default function Library() {
  const navigation = useNavigation();

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

  // Function to handle subfolder selection
  const handleSubfolderSelection = (subfolderName) => {
    // Navigate to the SubfolderScreen with the selected subfolder name
    //navigation.navigate("Test", { subfolderName });
    navigation.navigate("Tracker", { subfolderName });
  };

  return (
    <View style={{ flex: 1 }}>
      <Header navigation={navigation} />
      <View style={{ backgroundColor: "#d6d6e6", flex: 1 }}>
        <View style={styles.container}>
          <ScrollView>
            <Text
              style={{
                borderBottomWidth: 1,
                marginBottom: 5,
                borderBottomColor: "darkslateblue",
              }}
            >
              Folders
            </Text>
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
