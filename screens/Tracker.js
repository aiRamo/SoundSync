import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import Header from "../components/UI/header";
import React, { useState, useEffect } from "react";
import { useDataContext } from "../components/DataContext";
import { useDataContext2 } from "../components/DataContext2";

import { downloadAllItemsInCollection } from "../components/firebaseUtils";

export default function Tracker({ navigation, collectionName, route }) {
  const { data1 } = useDataContext();
  const { data2 } = useDataContext2();
  const [image, setImage] = useState(require("../assets/addScan.png"));
  const [collectionName1, setCollectionName] = useState(""); // Used with the context, will replace with navigation prop in the future
  const [coordinateData, setCoordinateData] = useState(null);
  const [noteData, setNoteData] = useState(null);

  handlePress = () => {
    console.log(data1);
    // Add any additional code you want to run when the TouchableOpacity is pressed here.
  };

  useEffect(() => {
    if (data2 != "") {
      setImage(data2);
    }
  }, [data2]);

  useEffect(() => {
    if (collectionName1 !== null) {
      const fetchData = async () => {
        const { imageUrls, jsonData } = await downloadAllItemsInCollection(
          collectionName1
        );
        if (imageUrls.length > 0) {
          setImage(imageUrls[0]); // Assuming there's only one image
        }
        if (jsonData.length === 2) {
          setCoordinateData(jsonData[0]); // Assuming the first JSON object is coordinateData
          setNoteData(jsonData[1]); // Assuming the second JSON object is noteData
          console.log("Coordinate Data:", jsonData[0]);
          console.log("Note Data:", jsonData[1]);
        }
      };
      fetchData();
    }
  }, [collectionName1]);

  useEffect(() => {
    if (route.params != null) {
      const { imgeUrl } = route.params;
      const { folder } = route.params;
      console.log(folder);
      setCollectionName(folder);
      setImage(imgeUrl);

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
        {image == require("../assets/addScan.png") && (
          <Image source={image} style={{ resizeMode: "contain" }} />
        )}
        {image != require("../assets/addScan.png") && (
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
