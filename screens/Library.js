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
import Card from "../components/Card";
import { Entypo, AntDesign } from "@expo/vector-icons";
import Drop from "../components/Drop";
import { AUTH } from "../firebaseConfig";

export default function Library({ navigation }) {
  const [imageUrls, setImageUrls] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    async function listFilesInFolder(folderPath) {
      const folderRef = ref(STORAGE, folderPath);
      const listResult = await listAll(folderRef);
      const urls = await Promise.all(
        listResult.items.map(async (itemRef) => {
          try {
            const url = await getDownloadURL(itemRef);
            return url;
          } catch (error) {
            console.error("Error downloading image:", error);
            return null;
          }
        })
      );
      setImageUrls(urls.filter((url) => url !== null));
    }

    listFilesInFolder("images/eP42yMFVDcdvkwroV3OrFv4yutH2/BenTestFolder/");
  }, []);

  const handleSignOut = async () => {
    try {
      await AUTH.signOut();
      navigation.navigate("Login", {});
      // Redirect or perform any other action after signing out.
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const filteredImageUrls = imageUrls.filter((imageUrl, index) =>
    `music page ${index}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TextInput
            placeholder="Search"
            placeholderTextColor="white"
            clearButtonMode="always"
            style={styles.search}
            onChangeText={(text) => setSearchQuery(text)}
          />
          <TouchableOpacity onPress={toggleDropdown}>
            <Entypo name="dots-three-vertical" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.container}>
        <View style={{ marginBottom: 10, flexDirection: "row" }}>
          <AntDesign name="filter" size={24} color="black" />
          <Text>Descending Order</Text>
        </View>
        <ScrollView>
          {filteredImageUrls.map((imageUrl, index) => (
            <Card
              key={index}
              imgeUrl={imageUrl}
              title={`music page ${index}`}
            ></Card>
          ))}
        </ScrollView>
        {/* Use the Dropdown component */}
        <Drop
          isVisible={isDropdownVisible}
          options={["Settings", "Sign Out", "Close"]}
          onSelect={handleDropdownSelect}
          onClose={() => setDropdownVisible(false)}
        />
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
