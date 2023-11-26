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
  const [isToggled2, setToggled2] = useState(false);
  const [inputText, setInputText] = useState("");
  const [confirmedText, setConfirmedText] = useState("");
  const [audioNote, setAudioNote] = useState([]);
  const [signal, setSignal] = useState("");
  const [highlightedIndexes, setHighlightIndexes] = useState([0]);
  const [theMap, setTheMap] = useState(new Map());
  const [leftPosition, setleftPosition] = useState(null);
  const [topPosition, setTopPosition] = useState(null);
  const [tempo, setTempo] = useState("");
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
          scroll();
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

          const array = [count3];
          setHighlightIndexes(array);

          setCount3((prevCount) => prevCount + 1);

          // Increment currIndex using the ref
        }
      }

      if (count3 == allArray[mainIndex].length - 1) {
        console.log("End of page");

        pageCount++;
        console.log(pageCount);
        if (pageCount != allArray.length) {
          console.log("going to next page");
          setMainIndex((prevCount) => prevCount + 1);
          setConfirmedText("");
          setCount3(0);
          scroll();
        } else {
          console.log("Reached the end");
          handlePress4();
        }
      }
    } else {
      console.log("Reached the end");
    }
  };

  const handlePress2 = () => {
    setToggled(!isToggled);
  };
  const handlePress4 = () => {
    setToggled2(!isToggled2);
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

  const handleTempoChange = (text) => {
    setTempo(text);
    console.log("tempo: ", text);
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
    if (audioNote != "" && isToggled2 && signal) {
      evaluateWithoutChords(audioNote);
    }
    //[isToggled,audioNote]
  }, [isToggled2, audioNote, signal]);
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
      handlePress4={handlePress4}
      isToggled={isToggled}
      isToggled2={isToggled2}
      collectionName1={collectionName1}
      tempo={tempo}
      handleTempoChange={handleTempoChange}
    />
  );
}
