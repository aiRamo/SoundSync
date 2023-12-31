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
import { ref, getDownloadURL, listAll, deleteObject } from "firebase/storage";
import { STORAGE } from "../firebaseConfig";
import Card2 from "../components/Card2";
import { Entypo, AntDesign } from "@expo/vector-icons";
import Drop from "../components/Drop";
import styles from "../components/styleSheetScan";
import { AUTH } from "../firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import RadialGradient from "../components/UI/RadialGradient";

export default function Library() {
  const navigation = useNavigation();

  const [user, setUser] = useState(null);
  const [subfolders, setSubfolders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

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
  async function listSubfolders2(folderPath) {
    const folderRef = ref(STORAGE, folderPath);
    const listResult = await listAll(folderRef);

    const subfolders = listResult.prefixes.map((prefix) => prefix.name);

    await Promise.all(
      subfolders.map(async (subfolder) => {
        const subfolderPath = `${folderPath}/${subfolder}`;
        await Delete(subfolderPath);
      })
    );

    console.log(subfolders);
  }
  async function Delete(folderPath) {
    try {
      const folderRef = ref(STORAGE, folderPath);
      const listResult = await listAll(folderRef);

      const itemsToDelete = listResult.items.map((item) => item.fullPath);

      // Delete each item inside the folder
      await Promise.all(
        itemsToDelete.map(async (itemPath) => {
          await deleteObject(ref(STORAGE, itemPath));
          console.log(`Deleted: ${itemPath}`);
        })
      );

      // Delete the folder itself
      // Uncomment the line below if you also want to delete the folder itself
      await deleteObject(folderRef);

      console.log(`All items inside ${folderPath} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting items:", error);
    }
  }

  // Function to handle subfolder selection
  const handleSubfolderSelection = (subfolderName) => {
    // Navigate to the SubfolderScreen with the selected subfolder name
    //navigation.navigate("Test", { subfolderName });
    navigation.navigate("Tracker", { subfolderName });
  };

  const handleDelete = async (subfolderName) => {
    const folderPath = `images/${user.uid}/sheetCollections/${subfolderName}`;
    const folderRef = ref(STORAGE, folderPath);

    try {
      // List all items (files and subfolders) in the folder
      const items = await listAll(folderRef);

      // Delete each item in the folder
      const deletePromises = items.items.map((item) => deleteObject(item));

      // Wait for all deletion promises to resolve
      await Promise.all(deletePromises);

      listSubfolders2(folderPath);

      setSubfolders((prevSubfolders) =>
        prevSubfolders.filter((folder) => folder !== subfolderName)
      );

      // After deleting the contents, delete the folder itself
      await deleteObject(folderRef);

      console.log("Folder and its contents deleted successfully");
    } catch (error) {
      console.error("Error deleting folder and its contents:", error);
    }
  };

  const filteredFolders = subfolders.filter((subFolder) =>
    subFolder.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={{ backgroundColor: "#d6d6e6", flex: 1 }}>
        <View style={[styles.gradientContainerScanner, { zIndex: 0 }]}>
          <RadialGradient style={{ ...styles.gradient, zIndex: 0 }} />
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 100,
          }}
        >
          <TextInput
            placeholder="Search"
            placeholderTextColor="darkslateblue"
            clearButtonMode="always"
            style={styles1.search}
            onChangeText={(text) => setSearchQuery(text)}
          />
        </View>
        <View style={styles1.container}>
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
            {filteredFolders.map((subfolderName, index) => (
              <Card2
                key={index}
                title={subfolderName}
                handleSubfolderSelection={() =>
                  handleSubfolderSelection(subfolderName)
                }
                handleDelete={() => handleDelete(subfolderName)}
              />
            ))}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles1 = StyleSheet.create({
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
    borderColor: "darkslateblue",
    color: "darkslateblue",
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
  },
});
