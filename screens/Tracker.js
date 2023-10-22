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
import React, { useState, useEffect, useRef } from "react";

import NoteHighlighter from "../components/UI/noteHighligher";

import { downloadAllItemsInCollection } from "../components/firebaseUtils";

const { width, height } = Dimensions.get("window");
const A4_RATIO = 1.4;
const ViewWidth = width * 0.7; // 90% of device width
const ViewHeight = ViewWidth * A4_RATIO;

export default function Tracker({ navigation, collectionName, route }) {
  const [isDefaultImage, setIsDefaultImage] = useState(true);
  const [image, setImage] = useState(require("../assets/addScan.png"));
  const [collectionName1, setCollectionName] = useState("");
  const [coordinateData, setCoordinateData] = useState(null);
  const [noteData, setNoteData] = useState(null);
  const [highlightNotes, setHighlightNotes] = useState(false);
  const [currIndex, setCurrIndex] = useState(0);
  const [noteArray, setNoteArray] = useState([]);
  const [currentNoteEvaluated, setCurrentNoteEvaluated] = useState("");
  const [audioNote, setAudioNote] = useState("");
  const [isMatch, setIsMatch] = useState(false);
  const currentNoteRef = useRef(null);
  const audioNoteRef = useRef(null);

  const arrayData = [
    "A4",
    "A#4",
    "A4",
    "B4",
    "B#4",
    "C4",
    "C4",
    "C#4",
    "E4",
    "C4",
    "D4",
    "D4",
    "B4",
    "B#4",
    "B4",
    "C4",
    "C4",
    "C#4",
    "E4",
    "C4",
    "G4",
    "C4",
    "C#4",
    "E4",
    "C4",
    "G4",
    "G#4",
    "A#4",
    "A4",
    "B4",
    "A4",
    "A#4",
    "A#4",
    "A4",
    "B4",
    "A4",
    "C4",
    "C4",
    "C#4",
    "E4",
    "G4",
    "A#4",
    "A#4",
    "A#4",
    "A#4",
  ];

  let timer;
  let count = 0;

  let currIndexRef = 0; // Create a ref for currIndex

  const evaluateNote = () => {
    if (count < arrayData.length) {
      console.log(
        "Audio Note: " +
          arrayData[count] +
          " | Current Note Evaluated: " +
          noteArray[currIndexRef] + // Access the ref
          " | Count: " +
          count
      );

      if (currentNoteEvaluated !== noteArray[currIndexRef]) {
        setCurrentNoteEvaluated(noteArray[currIndexRef]);
      }

      if (audioNote !== arrayData[count]) {
        setAudioNote(arrayData[count]);
      }

      // Check if both noteArray and coordinateData are not empty
      if (noteArray.length > 0 && coordinateData) {
        const currentNote = arrayData[count];
        const nextNoteInData = noteArray[currIndexRef]; // Access the ref

        //TODO: Make a state that controls a conditional compile that toggles the Font for both of the texts to be green.
        //TODO: Pause the program for 2 seconds, then turn OFF the conditional compile state so the texts go back to black.
        //TODO: You are conditionally compiling the two texts at 239
        if (currentNote === nextNoteInData) {
          console.log("MATCH FOUND");
          setIsMatch(true);
          // Increment currIndex using the ref
          currIndexRef++;
          setCurrIndex(currIndexRef);
        }
      }

      count++;

      //

      if (count < arrayData.length) {
        timer = setTimeout(evaluateNote, 1000);
      } else {
        // All notes have been evaluated
        setHighlightNotes(false);
      }
    }
  };

  const handlePress = () => {
    setHighlightNotes(true);
    count = 0; // Reset count to 0
    evaluateNote(); // Start the evaluation
  };

  useEffect(() => {
    if (highlightNotes === false) {
      setCurrIndex(0); // Reset currIndex to 0 when highlightNotes becomes false
      setAudioNote("");
      setCurrentNoteEvaluated("");
    }
  }, [highlightNotes]);

  useEffect(() => {
    if (isMatch) {
      if (currentNoteRef.current) {
        currentNoteRef.current.setNativeProps({ style: { color: "red" } });
      }
      if (audioNoteRef.current) {
        audioNoteRef.current.setNativeProps({ style: { color: "red" } });
      }

      setTimeout(() => {
        if (currentNoteRef.current) {
          currentNoteRef.current.setNativeProps({
            style: { color: "black" },
          });
        }
        if (audioNoteRef.current) {
          audioNoteRef.current.setNativeProps({
            style: { color: "black" },
          });
        }
        setIsMatch(false);
      }, 1000);
    }
  }, [isMatch]);

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
            const retrievedNoteArray = await retrieve(jsonData[1]); // Get the noteArray
            setNoteArray(retrievedNoteArray); // Set the noteArray in state
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

  async function retrieve(array) {
    let noteArray = [];
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
    console.log(noteArray[2]);
    return noteArray; // Return the noteArray
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
        <Text
          ref={currentNoteRef}
          style={{
            position: "absolute",
            top: "45%",
            left: "30%",
            fontSize: 56,
          }}
        >
          {currentNoteEvaluated}
        </Text>
        <Text
          ref={audioNoteRef}
          style={{
            position: "absolute",
            top: "45%",
            left: "55%",
            fontSize: 55,
          }}
        >
          {audioNote}
        </Text>
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
        onPress={handlePress}
      >
        <Text style={{ color: "white" }}> Highlight Notes </Text>
      </TouchableOpacity>
    </View>
  );
}
