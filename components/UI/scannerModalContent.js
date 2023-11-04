import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import styles from "../styleSheetScan"; // Replace with the actual path to your styles
import { downloadAllItemsInCollection } from "../firebaseUtils";
import CaretLeft from "../../assets/caret-left.png";
import CaretRight from "../../assets/caret-right.png";

import NoteHighlighter from "./noteHighligher";

const ScannerModalContent = ({
  navigation,
  serverMessage,
  doneLoading,
  setDoneLoading,
  onChangeCollectionName,
  collectionName,
  setScannerPhase,
}) => {
  const [listFilled, setListFilled] = useState(false);
  const [showNoteLocations, setShowNoteLocations] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [data, setData] = useState({
    imageUrls: [],
    parsedCoordinateDataList: [],
    noteDataList: [],
  });

  const previousItem = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const nextItem = () => {
    if (currentIndex < data.imageUrls.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const navigationControls = listFilled && (
    <View style={styles.imageCounterBar}>
      <TouchableOpacity
        onPress={previousItem}
        disabled={currentIndex === 0}
        style={[
          styles.caretTouchable,
          {
            right: "30vw",
            opacity: currentIndex === 0 ? 0 : 1,
          },
        ]}
      >
        <Image source={CaretLeft} style={styles.caretIconLeft} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={nextItem}
        disabled={currentIndex === data.imageUrls.length - 1}
        style={[
          styles.caretTouchable,
          {
            left: "30vw",
            opacity: currentIndex === data.imageUrls.length - 1 ? 0 : 1,
          },
        ]}
      >
        <Image source={CaretRight} style={styles.caretIconRight} />
      </TouchableOpacity>
    </View>
  );

  useEffect(() => {
    // A function to fetch and set the data
    const fetchData = async () => {
      try {
        const allData = await downloadAllItemsInCollection(collectionName);
        setData(allData);
      } catch (e) {
        console.log(e);
      } finally {
        console.log(data);
      }
    };

    if (doneLoading) {
      fetchData();
    }
  }, [doneLoading]);

  useEffect(() => {
    if (data.imageUrls.length > 0) {
      console.log(data);
      setListFilled(true);
    } else {
      console.log(data);
    }
  }, [data]);

  return (
    <View style={{ height: "100vh" }}>
      {!doneLoading && <Text style={styles.modalTitle}>{serverMessage}</Text>}
      {doneLoading && navigationControls}
      {doneLoading && (
        <>
          <Text style={styles.modalTitle}>Here is your generated image</Text>
          <View style={styles.modalImageView}>
            {listFilled && (
              <>
                <Image
                  source={{ uri: data.imageUrls[currentIndex] }}
                  style={styles.previewImage}
                />
                {showNoteLocations && (
                  <NoteHighlighter
                    notePositions={data.parsedCoordinateDataList[currentIndex]}
                    currIndex={-1}
                  />
                )}
              </>
            )}
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignSelf: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setShowNoteLocations((prev) => !prev);
              }}
              style={styles.showNotesButton}
            >
              <Text style={styles.blueButtonText}> Show Note Locations </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                onChangeCollectionName("");
                setDoneLoading(false);
                setDoneLoading(false);
                setScannerPhase(5);
              }}
              style={styles.closeButton}
            >
              <Text style={styles.redButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Tracker", { subfolderName: collectionName })
            }
            style={[styles.showNotesButton, { alignSelf: "center" }]}
          >
            <Text style={[styles.blueButtonText, { color: "green" }]}>
              Confirm
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default ScannerModalContent;
