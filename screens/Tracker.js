import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import Header from "../components/UI/header";
import React, { useState, useEffect } from "react";

import NoteHighlighter from "../components/UI/noteHighligher";

import { downloadAllItemsInCollection } from "../components/firebaseUtils";

const { width, height } = Dimensions.get("window");
const A4_RATIO = 1.4;
const ViewWidth = width * 0.7; // 90% of device width
const ViewHeight = ViewWidth * A4_RATIO;

export default function Tracker({ navigation, collectionName, route }) {
  const [isDefaultImage, setIsDefaultImage] = useState(true);
  const [image, setImage] = useState(require("../assets/addScan.png"));
  const [collectionName1, setCollectionName] = useState(""); // Used with the context, will replace with navigation prop in the future
  const [coordinateData, setCoordinateData] = useState(null);
  const [noteData, setNoteData] = useState(null);
  const [highlightNotes, setHighlightNotes] = useState(false);
  const [currIndex, setCurrIndex] = useState(-1);
  const arrayData = ["A4", "B4", "D4", "B2", "B3", "A2", "B3"];
  let noteArray = [];
  let timer;
  let count = 0;

  log = () => {
    console.log(arrayData[count]);
    //Alert.alert("Note:", arrayData[count]);

    const currIndex = count;

    setCurrIndex(currIndex);

    if (count == arrayData.length) {
      window.clearInterval(timer);
      count = 0;
      setHighlightNotes(false);
    }
    count++;
  };

  handlePress = () => {
    setHighlightNotes(true);
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
            console.log("Note Data:", JSON.stringify(jsonData[1]));
            retrieve(jsonData[1]);
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

  function retrieve(array) {
    for (const part of array) {
      for (const note of part.notes) {
        for (const pitch of note.pitch) {
          const step = pitch.step[0];
          const octave = pitch.octave[0];
          const temp = step + octave;
          noteArray.push(temp);
        }
      }
    }
    console.log(noteArray);
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#d6d6e6" }}>
      <Header style navigation={navigation} />

      <View
        style={{
          alignItems: "center",
          backgroundColor: "white",
          alignSelf: "center",
          marginTop: 25,
          borderRadius: 0,
          height: ViewHeight,
          width: ViewWidth,
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
            style={{
              resizeMode: "contain",
              height: ViewHeight,
              width: ViewWidth,
            }}
          />
        )}

        {highlightNotes && coordinateData && (
          <NoteHighlighter
            notePositions={JSON.parse(coordinateData)}
            currIndex={currIndex}
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
