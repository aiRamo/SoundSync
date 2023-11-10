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

const { width, height } = Dimensions.get("window");
const A4_RATIO = 1.4;
const ViewWidth = width * 0.26; // 90% of device width
const ViewHeight = ViewWidth * A4_RATIO;

export default function Tracker({ navigation, collectionName, route }) {
  const [isDefaultImage, setIsDefaultImage] = useState(true);
  const [image, setImage] = useState(require("../assets/addScan.png"));
  const [collectionName1, setCollectionName] = useState("");
  const [user, setUser] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [highlightNotes, setHighlightNotes] = useState(false);
  const [currIndex, setCurrIndex] = useState(0);
  const [currentNoteEvaluated, setCurrentNoteEvaluated] = useState("");
  const [audioNote, setAudioNote] = useState("");
  const [isMatch, setIsMatch] = useState(false);
  const currentNoteRef = useRef(null);
  const audioNoteRef = useRef(null);
  const [count2, setCount] = useState(0);
  const [allCoord, setAllCoord] = useState(null);
  const [allNote, setAllNote] = useState(null);
  const [allArray, setAllArray] = useState(null);
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
  let count = 0;

  let currIndexRef = 0; // Create a ref for currIndex
  //check the two notes
  const evaluateNote = () => {
    if (count < arrayData.length) {
      console.log(
        "Audio Note: " +
          arrayData[count] +
          " | Current Note Evaluated: " +
          // noteArray[currIndexRef] +
          allArray[0][currIndexRef] + // Access the ref
          " | Count: " +
          count
      );

      if (currentNoteEvaluated !== allArray[0][currIndexRef]) {
        setCurrentNoteEvaluated(allArray[0][currIndexRef]);
      }

      if (audioNote !== arrayData[count]) {
        setAudioNote(arrayData[count]);
      }

      // Check if both noteArray and coordinateData are not empty
      if (allArray[0].length && allCoord) {
        const currentNote = arrayData[count];
        const nextNoteInData = allArray[0][currIndexRef]; // Access the ref

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
      } else {
        // All notes have been evaluated
        setHighlightNotes(false);
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

  //matching stuff
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
    async function listFilesInFolder(folderPath) {
      try {
        const JsonPath = folderPath + "/sheetNoteData";
        const JsonCoord = folderPath + "/sheetCoordinateData";

        const folderRef = ref(STORAGE, folderPath);
        const folderRef2 = ref(STORAGE, JsonPath);
        const folderRef3 = ref(STORAGE, JsonCoord);

        const listResult = await listAll(folderRef);
        const listResult2 = await listAll(folderRef2);
        const listResult3 = await listAll(folderRef3);

        const urls = await Promise.all(
          listResult.items.map(async (itemRef) => {
            try {
              const fileName = itemRef.name.toLowerCase();
              setCount((prevCount) => prevCount + 1);
              const url = await getDownloadURL(itemRef);

              return url;
            } catch (error) {
              console.error("Error downloading image:", error);
              return null;
            }
          })
        );
        setImageUrls(urls.filter((url) => url !== null));
        //json note data
        const jsonNoteData = await Promise.all(
          listResult2.items.map(async (itemRef) => {
            try {
              const url = await getDownloadURL(itemRef);
              const response = await fetch(url);
              const jsonData = await response.json();

              return jsonData;
            } catch (error) {
              console.error(
                "Error getting JSON data for",
                itemRef.name,
                ":",
                error
              );
              return null;
            }
          })
        );
        //json coordinate data
        const jsonCoordData = await Promise.all(
          listResult3.items.map(async (itemRef) => {
            try {
              const url = await getDownloadURL(itemRef);
              const response = await fetch(url);
              const jsonData = await response.json();

              return jsonData;
            } catch (error) {
              console.error(
                "Error getting JSON data for",
                itemRef.name,
                ":",
                error
              );
              return null;
            }
          })
        );
        setAllCoord(jsonCoordData);
        setAllNote(jsonNoteData);
        let arrays = [];
        for (let i = 0; i < jsonNoteData.length - 1; i++) {
          const retrievedNoteArray = await retrieve(jsonNoteData[i]); // Get the noteArray
          arrays.push(retrievedNoteArray);
        }
        setAllArray(arrays);
      } catch (error) {
        console.error("Error listing files in folder:", error);
      }
    }

    if (user && collectionName1) {
      listFilesInFolder(
        `images/${user.uid}/sheetCollections/${collectionName1}`
      );
    }
  }, [user, collectionName1]);

  useEffect(() => {
    if (route.params != null) {
      const { subfolderName } = route.params;
      setCollectionName(subfolderName);
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

    return noteArray; // Return the noteArray
  }
  const startAutoScroll = () => {
    const scrollDuration = 1500;
    const scrollDistance = 500;
    let index = 0;

    console.log(count2);
    let scrollPosition = 0;
    const scrollView = scrollViewRef.current;

    const contentHeight = imageUrls.length * 500;

    const scrollInterval = setInterval(() => {
      if (index < count2) {
        scrollView.scrollTo({ y: scrollPosition, animated: true });
        scrollPosition += scrollDistance;
        index++;
      } else {
        clearInterval(scrollInterval);
      }
    }, scrollDuration);
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
      <TouchableOpacity
        style={{
          borderRadius: 6,
          backgroundColor: "#d4a32b",
          padding: 10,
          width: "10vw",
          alignSelf: "center",
          marginTop: 10,
          marginBottom: 10,
          alignItems: "center",
          zIndex: 6,
        }}
        onPress={startAutoScroll}
      >
        <Text style={{ color: "white", fontWeight: 600, fontSize: 18 }}>
          Start Scrolling
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

          {highlightNotes && allCoord[0] && (
            <NoteHighlighter
              notePositions={JSON.parse(allCoord[0])}
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
