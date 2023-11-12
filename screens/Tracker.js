import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import NoteHighlighter from "../components/UI/noteHighligher";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { downloadAllItemsInCollection } from "../components/firebaseUtils";
import { STORAGE } from "../firebaseConfig";
import { AUTH } from "../firebaseConfig";
import styles from "../components/styleSheetScan";
import RadialGradient from "../components/UI/RadialGradient";
import FileList, { retrieve } from "../components/TrackerHelp";
import { all } from "axios";

const { width, height } = Dimensions.get("window");
const A4_RATIO = 1.4;
const ViewWidth = width * 0.26; // 90% of device width
const ViewHeight = ViewWidth * A4_RATIO;

export default function Tracker({ navigation, collectionName, route }) {
  const [isDefaultImage, setIsDefaultImage] = useState(true);
  const [image, setImage] = useState(require("../assets/addScan.png"));
  const [collectionName1, setCollectionName] = useState("");
  const [user, setUser] = useState(null);
  const [highlightNotes, setHighlightNotes] = useState(false);
  const [currIndex, setCurrIndex] = useState(0);
  const [currentNoteEvaluated, setCurrentNoteEvaluated] = useState("");
  const [audioNote, setAudioNote] = useState("");
  const [isMatch, setIsMatch] = useState(false);
  const currentNoteRef = useRef(null);
  const audioNoteRef = useRef(null);
  const [mainIndex, setMainIndex] = useState(0);
  const [scroller, setScroller] = useState(0);
  const scrollViewRef = useRef(null);
  const arrayData = [
    "E4",
    "A4",
    "C4",
    "E4",
    "B4",
    "D4",
    "E4",
    "C5",
    "C4",
    "A2",
    "A3",
    "B2",
    "B3",
    "C3",
    "C4",
    "E4",
    "B4",
    "D4",
    "E4",
    "A4",
    "C4",
    "E4",
    "B4",
    "D4",
    "B2",
    "B3",
    "A2",
    "A3",
    "B2",
    "B3",
    "C5",
    "E4",
    "C3",
    "C4",
    "B4",
    "E4",
    "D4",
    "E4",
    "D4",
    "E4",
    "D4",
    "B2",
    "B3",
  ];

  let timer;
  let ownIndex = 0;
  let count = 0;

  let currIndexRef = 0; // Create a ref for currIndex
  const { imageUrls, allCoord, allNote, allArray, count2 } = FileList(
    user,
    collectionName1
  );
  //check the two notes
  const evaluateNote = () => {
    if (count < arrayData.length) {
      console.log(
        "Audio Note: " +
          arrayData[count] +
          " | Current Note Evaluated: " +
          // noteArray[currIndexRef] +
          allArray[mainIndex][currIndexRef] + // Access the ref
          " | Count: " +
          count
      );

      if (currentNoteEvaluated !== allArray[mainIndex][currIndexRef]) {
        setCurrentNoteEvaluated(allArray[mainIndex][currIndexRef]);
      }

      if (audioNote !== arrayData[count]) {
        setAudioNote(arrayData[count]);
      }

      // Check if both noteArray and coordinateData are not empty
      if (allArray[mainIndex].length && allCoord) {
        const currentNote = arrayData[count];
        const nextNoteInData = allArray[mainIndex][currIndexRef]; // Access the ref

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
      //timer for something
      if (count < arrayData.length) {
        timer = setTimeout(evaluateNote, 1000);
      } else if (ownIndex < allArray.length) {
        ownIndex++;
        console.log("Next page and index " + ownIndex);
        setMainIndex((prevCount) => prevCount + 1);
        count = 0;
        setCurrIndex(0);
        setHighlightNotes(true);
        clearTimeout(timer);
        scroll();
        evaluateNote();
      } else {
        // All notes have been evaluated
        setHighlightNotes(false);
        return;
      }
    }
  };
  //notehighlighter
  const handlePress = () => {
    setHighlightNotes(true);
    count = 0; // Reset count to 0
    evaluateNote(); // Start the evaluation
  };

  useEffect(() => {
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

  //note highlighter
  useEffect(() => {
    if (highlightNotes === false) {
      setCurrIndex(0); // Reset currIndex to 0 when highlightNotes becomes false
      setAudioNote("");
      setCurrentNoteEvaluated("");
    }
  }, [highlightNotes]);

  useEffect(() => {
    if (route.params != null) {
      const { subfolderName } = route.params;
      setCollectionName(subfolderName);
      console.log("here collection name " + collectionName1);
    }
  }, [route.params]);

  const scroll = () => {
    setScroller((prev) => prev + ViewHeight);

    // Use the callback function to ensure that scrollTo is called with the updated state
    setScroller((updatedScroller) => {
      const scrollView = scrollViewRef.current;
      scrollView.scrollTo({ y: updatedScroller, animated: true });
      return updatedScroller;
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#483d8b" }}>
      <View style={[styles.gradientContainerScanner, { zIndex: 0 }]}>
        <RadialGradient style={{ ...styles.gradient, zIndex: 0 }} />
      </View>
      <TouchableOpacity
        style={{
          borderRadius: 5,
          backgroundColor: "#d4a32b",
          padding: 10,
          width: "10vw",
          alignSelf: "center",
          marginTop: 80,
          marginBottom: 10,
          alignItems: "center",
          zIndex: 6,
        }}
        onPress={handlePress}
      >
        <Text style={{ color: "white", fontWeight: 600, fontSize: 18 }}>
          Highlight Notes
        </Text>
      </TouchableOpacity>

      <ScrollView ref={scrollViewRef}>
        <View
          style={{
            alignItems: "center",
            backgroundColor: "white",
            alignSelf: "center",
            marginTop: 25,
            borderRadius: 0,
            height: ViewHeight,
            width: ViewWidth,
            zIndex: 8,
          }}
        >
          <View
            style={{
              flexDirection: "column",
              flexWrap: "wrap",
              alignItems: "center",
              zIndex: 8,
            }}
          >
            {imageUrls.map((url, index) => (
              <Image
                key={index}
                source={{ uri: url }}
                onError={(error) => {
                  console.log("Image failed to load:", error);
                  // You can add an error message to the component state
                  // to display a message to the user.
                }}
                style={{
                  width: ViewWidth,
                  height: ViewHeight,
                  resizeMode: "contain",
                  zIndex: 8,
                }}
              />
            ))}
          </View>

          {highlightNotes && allCoord[mainIndex] && (
            <NoteHighlighter
              notePositions={JSON.parse(allCoord[mainIndex])}
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
              zIndex: 6,
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
              zIndex: 6,
            }}
          >
            {audioNote}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
