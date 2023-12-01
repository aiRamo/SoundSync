import { Dimensions } from "react-native";
import React, { useState, useEffect, useRef, useCallback } from "react";
import NoteHighlighter from "../components/UI/noteHighligher";
import { AUTH } from "../firebaseConfig";
import useAudioWebSocket from "../components/AudioWebSocket";
import { getDurationForNoteType } from "../components/TrackerHelp";
import FileList from "../components/TrackerHelp";
import TrackerContent from "../components/UI/TrackerContent";
import { count, not } from "mathjs";
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
  const [isToggled2, setToggled2] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [reachedEnd, setReachedEnd] = useState(false);
  const [confirmedText, setConfirmedText] = useState("");
  const [audioNote, setAudioNote] = useState([]);
  const [signal, setSignal] = useState("");
  const [highlightedIndexes, setHighlightIndexes] = useState([0]);
  const [theMap, setTheMap] = useState(new Map());
  const [leftPosition, setleftPosition] = useState(null);
  const [topPosition, setTopPosition] = useState(null);
  const [change, setChange] = useState([]);

  const { imageUrls, allCoord, allNote, allArray } = FileList(
    user,
    collectionName1
  );

  let pageCount = 0;

  // Custom callback similar to useEffect that is only triggered when the websocket sends data.
  const getAudioModuleData = useCallback((newData) => {
    // console.log(newData.trimmedValues);
    setSignal((prevCount) => prevCount + 1);
    // console.log(newData);
    setAudioNote(newData.noteString);
  }, []);

  // Set up the WebSocket connection
  useAudioWebSocket(getAudioModuleData, setIsListening);

  /*
  useEffect(() => {
    console.log(audioNote);
  }, [audioNote]);
  */

  const evaluateNote2 = (note) => {
    if (mainIndex < allArray.length) {
      pageCount = mainIndex;
      let check = 0;
      console.log(change[2]);

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

        if (note[0][0] == nextNoteInData[0]) {
          console.log("letters match");
          check = 1;
        }

        if (note[0] === nextNoteInData || check == 1) {
          console.log("MATCH FOUND");
          console.log("Map for testing: ", theMap);
          setIsMatch(true);

          if (theMap.get(leftPosition[count3]).length >= 1) {
            const array = theMap.get(leftPosition[count3]);
            if (array[0] == count3) {
              console.log("Associated array", array);

              for (let i = 0; i < array.length; i++) {
                console.log("CHORD HERE AT INDEX ", array[i]);
                console.log("The notes", allArray[mainIndex][array[i]]);
              }

              setHighlightIndexes(array);
            } else {
              const array = [count3];
              setHighlightIndexes(array);
            }
          }

          setCount3((prevCount) => prevCount + 1);
          check = 0;

          // Increment currIndex using the ref
        }
      }

      if (count3 == change[2]) {
        console.log("End of page");

        pageCount++;
        console.log(pageCount);
        if (pageCount != allArray.length) {
          console.log("going to next page");
          setMainIndex((prevCount) => prevCount + 1);
          setConfirmedText("");
          setCount3(0);
        } else {
          console.log("Reached the end");
          handlePress2();
        }
      }
    } else {
      console.log("Reached the end");
    }
  };
  const evaluateWithoutChords = (note) => {
    if (mainIndex < allArray.length) {
      pageCount = mainIndex;

      /*console.log(
        "Audio: " +
          note +
          " |Curr Note: " +
          // noteArray[currIndexRef] +
          allArray[mainIndex][count3][0][0] + // Access the ref
          " | Count: " +
          count3
      );*/

      if (allArray[mainIndex].length && allCoord) {
        // console.log("here the coord " + allPos[count3]);
        const nextNoteInData = allArray[mainIndex][count3][0][0];

        if (note[0].includes(nextNoteInData)) {
          console.log("MATCH FOUND");
          console.log("Map for testing: ", theMap);
          setIsMatch(true);

          const array = [count3];
          setHighlightIndexes(array);

          setCount3((prevCount) => prevCount + 1);
        }
      }

      if (count3 == allArray[mainIndex].length - 1) {
        console.log("End of page");

        pageCount++;
        console.log(pageCount);
        if (pageCount != allArray.length) {
          console.log("going to next page");
          setCount3(0);
          setHighlightIndexes([0]);
          setMainIndex((prevCount) => prevCount + 1);
          setConfirmedText("");
        } else {
          console.log("Reached the end");
          setCount3((prevCount) => prevCount + 1);
          const array = [count3];
          setHighlightIndexes(array);

          setReachedEnd(true);
        }
      }
    } else {
      console.log("Reached the end");
    }
  };

  const handlePress3 = () => {
    navigation.navigate("Home", {});
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
    if (count3 == 0 && mainIndex != 0) {
      scroll();
    }
  }, [count3, mainIndex]);
  useEffect(() => {
    if (allArray != null) {
      console.log("mainIndex:", allArray);
    }
  }, [mainIndex, allArray]);

  useEffect(() => {
    if (isToggled) {
      setHighlightNotes("true");
    }
  }, [isToggled]);
  useEffect(() => {
    if (isToggled2) {
      setHighlightNotes("true");
    }
  }, [isToggled2]);
  useEffect(() => {
    if (audioNote != "" && isToggled && signal) {
      evaluateNote2(audioNote);
    }
    //[isToggled,audioNote]
  }, [isToggled, audioNote, signal]);
  useEffect(() => {
    if (allArray) {
      if (audioNote != "" && isToggled2 && signal && !reachedEnd) {
        evaluateWithoutChords(audioNote);
      }
    }

    //[isToggled,audioNote]
  }, [isToggled2, audioNote, signal, allArray, reachedEnd]);
  useEffect(() => {
    if (allCoord) {
      if (mainIndex >= 0) {
        setTheMap(map);
        setleftPosition(leftPositions);
        setTopPosition(topPositions);
      }
      const { map, leftPositions, topPositions } = mapping(allCoord, mainIndex);
    }
  }, [allCoord, mainIndex]);

  /*useEffect(() => {
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
  }, [allArray, isToggled]);*/
  useEffect(() => {
    if (!isToggled2 && allArray) {
      setMainIndex(0);
      setCount3(0);
      setConfirmedText("");
      setHighlightNotes(null);
      setHighlightIndexes([0]);
      console.log("Ending play mode");
    }
  }, [allArray, isToggled2]);
  useEffect(() => {
    if (topPosition) {
      topPosition.sort((a, b) => a - b);
      for (let i = 0; i < topPosition.length; i++) {
        if (i != 0) {
          if (topPosition[i - 1] != topPosition[i]) {
            const array = [];
            array.push(i);
            setChange((prevArray) => [...prevArray, i]);
          }
        }
      }
    }
  }, [topPosition]);

  const scroll = () => {
    setScroller((prev) => {
      const newScrollPosition = prev + ViewHeight;
      const scrollView = scrollViewRef.current;
      if (scrollView) {
        scrollView.scrollToEnd({ animated: true });
      }
      return newScrollPosition;
    });
  };

  return (
    <TrackerContent
      imageUrls={imageUrls}
      allCoord={allCoord}
      highlightedIndexes={highlightedIndexes}
      mainIndex={mainIndex}
      scrollViewRef={scrollViewRef}
      handlePress3={handlePress3}
      collectionName1={collectionName1}
      isListening={isListening}
      reachedEnd={reachedEnd}
    />
  );
}
