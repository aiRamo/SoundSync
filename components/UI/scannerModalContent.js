import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, Dimensions } from "react-native";
import styles from "../styleSheetScan"; // Replace with the actual path to your styles
import { downloadAllItemsInCollection } from "../firebaseUtils";
import Pagination from "./Pagination";

import NoteHighlighter from "./noteHighligher";
import SvgWithScript from "./scannerLoader";

const { width, height } = Dimensions.get("window");

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
    <View style={{ height: "100vh", alignSelf: "center" }}>
      {!doneLoading && (
        <>
          <Text style={[styles.introTitle, { marginTop: "8%" }]}>
            {serverMessage}
          </Text>
          <SvgWithScript />
        </>
      )}
      {doneLoading && (
        <>
          <Text style={styles.modalTitle}>Here is your generated image</Text>
          <Pagination
            count={data.imageUrls.length}
            setImageIndex={setCurrentIndex}
            showLastSpecial={false}
          />
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
            style={[
              styles.showNotesButton,
              {
                alignSelf: "center",
                width: width * 0.07,
                backgroundColor: "#d4a32b",
              },
            ]}
          >
            <Text style={styles.openButtonText}>Confirm</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default ScannerModalContent;
