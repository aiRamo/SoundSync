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
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { downloadAllItemsInCollection } from "../components/firebaseUtils";
import { STORAGE } from "../firebaseConfig";
import { AUTH } from "../firebaseConfig";

const { width, height } = Dimensions.get("window");
const A4_RATIO = 1.4;
const ViewWidth = width * 0.26; // 90% of device width
const ViewHeight = ViewWidth * A4_RATIO;

export default function Tracker({ navigation, collectionName, route }) {
  const [isDefaultImage, setIsDefaultImage] = useState(true);
  const [image, setImage] = useState(require("../assets/addScan.png"));
  const [collectionName1, setCollectionName] = useState("");
  const [collectionName2, setCollectionName2] = useState("");
  const [user, setUser] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
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

  /*const arrayData = [
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

  //get folder name
  /*
  useEffect(() => {
    if (collectionName2 !== "") {
      console.log(`fetching data... collectionName = ${collectionName2}`);

      const fetchData = async () => {
        const result = await downloadAllItemsInCollection(collectionName2);
        console.log(result);
        if (result) {
          // Check if result is not null
          const { jsonData } = result;

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
  }, [collectionName2]);
  */

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
        const urls2 = await Promise.all(
          listResult2.items.map(async (itemRef) => {
            try {
              const url = await getDownloadURL(itemRef);
              console.log("URL for", itemRef.name, ":", url);
            } catch (error) {
              console.error("Error getting URL:", error);
            }
          })
        );
        //json coordinate data
        const urls3 = await Promise.all(
          listResult3.items.map(async (itemRef) => {
            try {
              const url = await getDownloadURL(itemRef);
              console.log("URL for", itemRef.name, ":", url);
            } catch (error) {
              console.error("Error getting URL:", error);
            }
          })
        );
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

  return (
    <View style={{ flex: 1, backgroundColor: "#d6d6e6" }}>
      <Header navigation={navigation} />
      <TouchableOpacity
        style={{
          borderRadius: 5,
          backgroundColor: "darkslateblue",
          padding: 10,
          marginLeft: 212,
          marginRight: 232,
          marginTop: 10,
          marginBottom: 10,
          alignItems: "center",
        }}
        onPress={handlePress}
      >
        <Text style={{ color: "white" }}> Highlight Notes </Text>
      </TouchableOpacity>
      <ScrollView>
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
          <View
            style={{
              flexDirection: "column",
              flexWrap: "wrap",
              alignItems: "center",
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
                style={{ width: 500, height: 500, resizeMode: "contain" }}
              />
            ))}
          </View>

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
      </ScrollView>
    </View>
  );
}
