import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import Header from "../components/UI/header";
import React, { useState, useEffect } from "react";

import { downloadAllItemsInCollection } from "../components/firebaseUtils";

export default function Tracker({ navigation, collectionName, route }) {
  const [isDefaultImage, setIsDefaultImage] = useState(true);
  const [image, setImage] = useState(require("../assets/addScan.png"));
  const [collectionName1, setCollectionName] = useState(""); // Used with the context, will replace with navigation prop in the future
  const [coordinateData, setCoordinateData] = useState(null);
  const [noteData, setNoteData] = useState(null);
  const arrayData = ["A1", "B1", "B3", "B5", "D7", "F1"];
  let timer;
  let count = 0;

  log = () => {
    console.log(arrayData[count]);
    Alert.alert("Note:", arrayData[count]);
    if (count == arrayData.length - 1) {
      window.clearInterval(timer);
      count = 0;
    }
    count++;
  };

  handlePress = () => {
    timer = window.setInterval(log, 1000);
    // Add any additional code you want to run when the TouchableOpacity is pressed here.
  };

  useEffect(() => {
    if (collectionName1 !== "") {
      console.log(`fetching data... collectionName = ${collectionName1}`);
      const fetchData = async () => {
        const result = await downloadAllItemsInCollection(collectionName1);
        if (result) {
          // Check if result is not null
          const { firstImageUrl, jsonData } = result;
          if (firstImageUrl && firstImageUrl.length > 0) {
            // Null and length check
            setImage(firstImageUrl); // Assuming there's only one image
            setIsDefaultImage(false); // Set to false when you have a new image
          }
          if (jsonData && jsonData.length >= 2) {
            // Null and length check
            setCoordinateData(jsonData[0]); // Assuming the first JSON object is coordinateData
            setNoteData(jsonData[1]); // Assuming the second JSON object is noteData
            console.log("Coordinate Data:", jsonData[0]);
            console.log("Note Data:", jsonData[1]);
          }
        }
      };
      fetchData();
    }
  }, [collectionName1]);

  useEffect(() => {
    if (route.params != null) {
      const { folder } = route.params;
      console.log(folder);
      setCollectionName(folder);

      console.log("here collection name " + collectionName1);
    }
  }, [route.params]);

  return (
    <View style={{ flex: 1, backgroundColor: "#d6d6e6" }}>
      <Header style navigation={navigation} />

      <View
        style={{
          alignItems: "center",
          backgroundColor: "white",
          marginLeft: 50,
          marginRight: 50,
          marginTop: 50,
          borderRadius: 20,
          flex: 0.9,
        }}
      >
        {isDefaultImage ? (
          <Image
            source={require("../assets/addScan.png")}
            style={{ resizeMode: "contain" }}
          />
        ) : (
          <Image
            source={{ uri: image }}
            style={{ resizeMode: "contain", height: "100%", width: "100%" }}
          />
        )}
      </View>

      <TouchableOpacity
        style={{
          borderRadius: 5,
          backgroundColor: "darkslateblue",
          padding: 10,
          marginLeft: 50,
          marginRight: 50,
          marginTop: 10,
          alignItems: "center",
        }}
        onPress={this.handlePress}
      >
        <Text style={{ color: "white" }}>Highlight Notes</Text>
      </TouchableOpacity>
    </View>
  );
}
