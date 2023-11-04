import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import styles from "../styleSheetScan"; // Replace with the actual path to your styles
import { downloadAllItemsInCollection } from "../firebaseUtils";

import NoteHighlighter from "./noteHighligher";

const ScannerModalContent = ({
  serverMessage,
  doneLoading,
  setDoneLoading,
  onChangeCollectionName,
  collectionName,
  setScannerPhase,
}) => {
  const [listFilled, setListFilled] = useState(false);
  const [showNoteLocations, setShowNoteLocations] = useState(false);

  const [data, setData] = useState({
    imageUrls: [],
    parsedCoordinateDataList: [],
    noteDataList: [],
  });

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
      {doneLoading && (
        <>
          <Text style={styles.modalTitle}>Here is your generated image</Text>
          <View style={styles.modalImageView}>
            {listFilled && (
              <>
                <Image
                  source={{ uri: data.imageUrls[0] }}
                  style={styles.previewImage}
                />
                {showNoteLocations && (
                  <NoteHighlighter
                    notePositions={data.parsedCoordinateDataList[0]}
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
        </>
      )}
    </View>
  );
};

export default ScannerModalContent;
