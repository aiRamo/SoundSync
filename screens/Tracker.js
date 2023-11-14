import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  StyleSheet,
  TextInput,
  StatusBar,
  Button,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import NoteHighlighter from "../components/UI/noteHighligher";
import { AUTH } from "../firebaseConfig";
import styles from "../components/styleSheetScan";
import RadialGradient from "../components/UI/RadialGradient";
import FileList from "../components/TrackerHelp";
import { all } from "axios";

const { width, height } = Dimensions.get("window");
const A4_RATIO = 1.4;
const ViewWidth = width * 0.26; // 90% of device width
const ViewHeight = ViewWidth * A4_RATIO;

export default function Tracker({ navigation, route }) {
  const [collectionName1, setCollectionName] = useState("");
  const [user, setUser] = useState(null);
  const [highlightNotes, setHighlightNotes] = useState(false);
  const [currIndex, setCurrIndex] = useState(0);
  const [currentNoteEvaluated, setCurrentNoteEvaluated] = useState("");
  const [isMatch, setIsMatch] = useState(false);
  const [mainIndex, setMainIndex] = useState(0);
  const [count3, setCount3] = useState(0);
  const [scroller, setScroller] = useState(0);
  const scrollViewRef = useRef(null);
  const [isToggled, setToggled] = useState(false);
  const [inputText, setInputText] = useState("");
  const [confirmedText, setConfirmedText] = useState("");
  const [audioNote, setAudioNote] = useState("");
  //audio crew use this

  /*
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
  */
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
  /*
  const evaluateNote = () => {
    if (count < arrayData.length) {
      console.log(
        "Audio Note: " +
          arrayData[count] +
          " | Current Note Evaluated: " +
          // noteArray[currIndexRef] +
          allArray[ownIndex][currIndexRef] + // Access the ref
          " | Count: " +
          count
      );

      if (currentNoteEvaluated !== allArray[ownIndex][currIndexRef]) {
        setCurrentNoteEvaluated(allArray[ownIndex][currIndexRef]);
      }

      if (audioNote !== arrayData[count]) {
        setAudioNote(arrayData[count]);
      }

      // Check if both noteArray and coordinateData are not empty
      if (allArray[ownIndex].length && allCoord) {
        const currentNote = arrayData[count];
        const nextNoteInData = allArray[ownIndex][currIndexRef]; // Access the ref

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
        ownIndex = 0;
        setHighlightNotes(false);
      }
    }
  };
*/

  const evaluateNote2 = (note) => {
    if (mainIndex < allArray.length) {
      console.log(
        "Audio Note: " +
          note +
          " | Current Note Evaluated: " +
          // noteArray[currIndexRef] +
          allArray[mainIndex][count3] + // Access the ref
          " | Count: " +
          count3
      );

      if (allArray[mainIndex].length && allCoord) {
        const nextNoteInData = allArray[mainIndex][count3];

        if (note === nextNoteInData) {
          console.log("MATCH FOUND");
          setIsMatch(true);
          // Increment currIndex using the ref

          setCount3((prevCount) => prevCount + 1);
        }
      }
      if (count3 == allArray[mainIndex].length - 1) {
        console.log("We reached the end");
        setConfirmedText("");
        setMainIndex((prevCount) => prevCount + 1);
        setCount3(0);
        scroll();
      }
    } else {
      console.log("Reached the end");
    }
  };
  //notehighlighter
  /*
  const handlePress = () => {
    setHighlightNotes(true);
    count = 0; // Reset count to 0
    evaluateNote(); // Start the evaluation
  };
  */

  const handlePress2 = () => {
    setToggled(!isToggled);
  };
  const handleConfirm = () => {
    if (isToggled) {
      setConfirmedText(inputText);
    }

    // You can perform additional actions or validations here
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
  /*
  useEffect(() => {
    if (highlightNotes === false) {
      setCurrIndex(0); // Reset currIndex to 0 when highlightNotes becomes false
      setAudioNote("");
      setCurrentNoteEvaluated("");
    }
  }, [highlightNotes]);
  */

  useEffect(() => {
    if (route.params != null) {
      const { subfolderName } = route.params;
      setCollectionName(subfolderName);
      console.log("here collection name " + collectionName1);
    }
  }, [route.params]);
  useEffect(() => {
    if (allArray != null) {
      console.log("mainIndex:", allArray[mainIndex]);
    }
  }, [mainIndex, allArray]);

  useEffect(() => {
    if (isToggled) {
      setHighlightNotes("true");
    }
  }, [isToggled]);
  useEffect(() => {
    //if(audioNote != "" && isToggled)
    if (confirmedText != "" && isToggled) {
      evaluateNote2(confirmedText);
    }
    //[isToggled,audioNote]
  }, [isToggled, confirmedText]);
  useEffect(() => {
    if (!isToggled && allArray) {
      setMainIndex(0);
      setCount3(0);
      setConfirmedText("");
      setHighlightNotes(null);
      console.log("Ending play mode");
    }
  }, [allArray, isToggled]);

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

      <View style={{ marginTop: 50 }}>
        <TouchableOpacity
          style={[styles2.button, isToggled && styles2.toggledButton]}
          onPress={handlePress2}
        >
          <Text style={styles2.buttonText}>Play Mode</Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginLeft: 400, marginRight: 400, marginTop: 10 }}>
        <TextInput
          style={{ backgroundColor: "white" }}
          placeholder="Type here..."
          onChangeText={(text) => setInputText(text)}
          value={inputText}
        />
        <Button title="Confirm" onPress={handleConfirm} />
      </View>

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
          {imageUrls.map((url, index) => (
            <View key={index}>
              <Image
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

              {highlightNotes && allCoord[index] && (
                <NoteHighlighter
                  key={`noteHighlighter_${index}`}
                  notePositions={JSON.parse(allCoord[index])}
                  currIndex={count3}
                />
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
const styles2 = StyleSheet.create({
  button: {
    padding: 10,
    backgroundColor: "#3498db",
    borderRadius: 5,
    alignItems: "center",
    alignSelf: "center",
  },
  toggledButton: {
    backgroundColor: "#2c3e50", // Darkened color for toggled state
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
