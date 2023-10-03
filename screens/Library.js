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
import { ref, getDownloadURL, listAll, getMetadata } from "firebase/storage";
import { STORAGE } from "../firebaseConfig";
import Card from "../components/Card";
import { Entypo, AntDesign } from "@expo/vector-icons";
import Drop from "../components/Drop";
import { AUTH } from "../firebaseConfig";

export default function Library({ navigation, route }) {
  const [imageUrls, setImageUrls] = useState([]);
  const [imageDates, setImageDates] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isDescendingOrder, setIsDescendingOrder] = useState(true);
  const [user, setUser] = useState(null);
  const { subfolderName } = route.params;

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
    async function listFilesInFolder(folderPath) {
      const folderRef = ref(STORAGE, folderPath);
      const listResult = await listAll(folderRef);
      const urls = await Promise.all(
        listResult.items.map(async (itemRef) => {
          try {
            const url = await getDownloadURL(itemRef);
            getMetadata(itemRef).then((metadata) => {
              // Metadata now contains the metadata for 'images/forest.jpg'
              const creationTime = metadata.timeCreated;

              setImageDates((prevDates) => [...prevDates, creationTime]);
            });
            return url;
          } catch (error) {
            console.error("Error downloading image:", error);
            return null;
          }
        })
      );
      setImageUrls(urls.filter((url) => url !== null));
    }

    if (user) {
      // Check if user is defined
      listFilesInFolder(`images/${user.uid}/sheetCollections/${subfolderName}`);
    }
  }, [user]);

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

  const toggleDescendingOrder = () => {
    // Toggle the sorting order
    setIsDescendingOrder(!isDescendingOrder);
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
      <View style={{ backgroundColor: "#d6d6e6", flex: 1 }}>
        <View style={styles.container}>
          <View style={{ marginBottom: 10, flexDirection: "row" }}>
            <TouchableOpacity onPress={toggleDescendingOrder}>
              <AntDesign
                name={isDescendingOrder ? "arrowdown" : "arrowup"} // Change the icon based on the sorting order
                size={24}
                color="black"
              />
            </TouchableOpacity>
            <Drop
              isVisible={isDropdownVisible}
              options={["Settings", "Sign Out", "Close"]}
              onSelect={handleDropdownSelect}
              onClose={() => setDropdownVisible(false)}
            />
            <Text>
              {isDescendingOrder ? "Descending Order" : "Ascending Order"}
            </Text>
          </View>
          <ScrollView>
            {filteredImageUrls.map((imageUrl, index) => (
              <Card
                key={index}
                imgeUrl={imageUrl}
                title={`music page ${index}`}
                date={imageDates[index]}
                navigation={navigation}
              ></Card>
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
