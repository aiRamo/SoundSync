import { Dimensions } from "react-native";
import React, { useState, useEffect, useRef, useCallback } from "react";
import NoteHighlighter from "../components/UI/noteHighligher";
import { AUTH } from "../firebaseConfig";
import useAudioWebSocket from "../components/AudioWebSocket";
import FileList from "../components/TrackerHelp";
import TrackerContent from "../components/UI/TrackerContent";
import { not } from "mathjs";
import mapping from "../components/mapping";

const { width, height } = Dimensions.get("window");
const A4_RATIO = 1.4;
const ViewWidth = width * 0.26; // 90% of device width
const ViewHeight = ViewWidth * A4_RATIO;

export default function Tracker({ navigation, route }) {
  const [collectionName1, setCollectionName] = useState("");
  const [user, setUser] = useState(null);
  const [highlightNotes, setHighlightNotes] = useState(false);
  const [isMatch, setIsMatch] = useState(false);
  const [mainIndex, setMainIndex] = useState(0);
  const [count3, setCount3] = useState(0);
  const [scroller, setScroller] = useState(0);
  const scrollViewRef = useRef(null);
  const [isToggled, setToggled] = useState(false);
  const [inputText, setInputText] = useState("");
  const [confirmedText, setConfirmedText] = useState("");
  const [audioNote, setAudioNote] = useState([]);
  const [signal, setSignal] = useState("");
  const [highlightedIndexes, setHighlightIndexes] = useState([0]);
  const [theMap, setTheMap] = useState(new Map());
  const [leftPosition, setleftPosition] = useState(null);
  const [topPositoon, setTopPosition] = useState(null);

  const { imageUrls, allCoord, allNote, allArray } = FileList(
    user,
    collectionName1
  );

  // Custom callback similar to useEffect that is only triggered when the websocket sends data.
  const getAudioModuleData = useCallback((newData) => {
    // console.log(newData.trimmedValues);
    setSignal((prevCount) => prevCount + 1);
    // console.log(newData);
    setAudioNote(newData.trimmedValues);
  }, []);

  // Set up the WebSocket connection
  useAudioWebSocket(getAudioModuleData);

  /*
  useEffect(() => {
    console.log(audioNote);
  }, [audioNote]);
  */

  const evaluateNote2 = (note) => {
    if (mainIndex < allArray.length) {
      console.log(
        "Audio: " +
          note +
          " |Curr Note: " +
          // noteArray[currIndexRef] +
          allArray[mainIndex][count3] + // Access the ref
          " | Count: " +
          count3
      );

      if (allArray[mainIndex].length && allCoord) {
        // console.log("here the coord " + allPos[count3]);
        const nextNoteInData = allArray[mainIndex][count3];

        if (note[0] === nextNoteInData) {
          console.log("MATCH FOUND");
          console.log("Map for testing: ", theMap);
          setIsMatch(true);

          if (theMap.get(leftPosition[count3]).length > 1) {
            const array = theMap.get(leftPosition[count3]);
            console.log("chord: ", note);
            for (let i = 0; i < array.length; i++) {
              console.log("CHORD HERE AT INDEX ", array[i]);
              console.log("The notes", allArray[mainIndex][array[i]]);
            }

            setHighlightIndexes(array);
          } else {
            const array = [count3];
            setHighlightIndexes(array);
          }

          setCount3((prevCount) => prevCount + 1);

          // Increment currIndex using the ref
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

  const handlePress2 = () => {
    setToggled(!isToggled);
  };
  const handlePress3 = () => {
    navigation.navigate("Home", {});
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
    if (audioNote != "" && isToggled && signal) {
      evaluateNote2(audioNote);
    }
    //[isToggled,audioNote]
  }, [isToggled, audioNote, signal]);
  useEffect(() => {
    if (allCoord) {
      const { map, leftPositions, topPositions } = mapping(allCoord, mainIndex);
      setTheMap(map);
      setleftPosition(leftPositions);
      setTopPosition(topPositions);
    }
  }, [allCoord, mainIndex]);

  useEffect(() => {
    if (!isToggled && allArray) {
      setMainIndex(0);
      setCount3(0);
      setConfirmedText("");
      setHighlightNotes(null);
      const { map, leftPositions, topPositions } = mapping(allCoord, 0);
      setTheMap(map);
      setleftPosition(leftPositions);
      setTopPosition(topPositions);
      setHighlightIndexes([0]);
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
    <TrackerContent
      imageUrls={imageUrls}
      allCoord={allCoord}
      count3={count3}
      highlightedIndexes={highlightedIndexes}
      highlightNotes={highlightNotes}
      scrollViewRef={scrollViewRef}
      handlePress2={handlePress2}
      handlePress3={handlePress3}
      isToggled={isToggled}
      collectionName1={collectionName1}
    />
  );
}
