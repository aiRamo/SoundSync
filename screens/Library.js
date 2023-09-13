import {
  View,
  Text,
  ScrollView,
  image,
  Image,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
} from "react-native";
import React, { useState, useEffect } from "react";
import { checkCurrentUser } from "../components/firebaseUtils";
import { ref, getDownloadURL } from "firebase/storage";
import { STORAGE } from "../firebaseConfig";

export default function Library() {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    // Create a reference to the image in Firebase Storage
    const storageRef = ref(
      STORAGE,
      "images/eP42yMFVDcdvkwroV3OrFv4yutH2/inputFile/eP42yMFVDcdvkwroV3OrFv4yutH2.jpg"
    ); // Replace with your image path

    // Get the download URL for the image
    getDownloadURL(storageRef)
      .then((url) => {
        // Set the image URL in the state
        setImageUrl(url);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error downloading image:", error);
      });
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.container2}>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={{ width: 200, height: 75 }}
            />
          ) : (
            <Text>Loading image...</Text>
          )}
          <Text style={{ marginLeft: 10 }}>Music page 1</Text>

          <TouchableOpacity style={styles.touching}>
            <Text style={{ fontSize: 15, color: "white" }}>Load</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.container2}>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={{ width: 200, height: 75 }}
            />
          ) : (
            <Text>Loading image...</Text>
          )}

          <Text style={{ marginLeft: 10 }}>Music page 2</Text>

          <TouchableOpacity style={styles.touching}>
            <Text style={{ fontSize: 15, color: "white" }}>Load</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.container2}>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={{ width: 200, height: 75 }}
            />
          ) : (
            <Text>Loading image...</Text>
          )}

          <Text style={{ marginLeft: 10 }}>Music page 3</Text>

          <TouchableOpacity style={styles.touching}>
            <Text style={{ fontSize: 15, color: "white" }}>Load</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
    marginLeft: 10,
    marginRight: 10,
  },
  container2: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "black",
    borderWidth: 1,
    marginBottom: 10,
  },
  touching: {
    marginLeft: 10,
    borderRadius: 5,
    backgroundColor: "darkslateblue",
    padding: 10,
    alignItems: "center",
  },
});
