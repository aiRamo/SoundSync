import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, Dimensions, ScrollView } from "react-native";
import styles from "../styleSheetScan"; // Replace with the actual path to your styles
import { downloadAllItemsInCollection } from "../firebaseUtils";
import Pagination from "./Pagination";

import NoteHighlighter from "./noteHighligher";
import SvgWithScript from "./scannerLoader";

import RightArrow from "../../assets/right-arrow.png";

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
      <View style={{ flex: 1, alignSelf: "center", width: width }}>
        {!doneLoading && (
          <>
            <Text
              style={[
                styles.introTitle,
                { marginTop: "8%", width: width * 0.7, alignSelf: "center" },
              ]}
            >
              {serverMessage}
            </Text>
            <SvgWithScript />
          </>
        )}
        {doneLoading && (
          <ScrollView style={{flex: 1, maxHeight: height * 1.2}}>
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
            <View style={styles.testButtonContainer}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Tracker", {
                    subfolderName: collectionName,
                  })
                }
                style={{ flex: 1, minWidth: width* 0.1 }}
              >
                <Text style={styles.scanButtonText}>Confirm</Text>
                <Image
                  source={RightArrow}
                  style={[styles.downArrowIcon, { marginBottom: 30 }]}
                />
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </View>
  );
};

export default ScannerModalContent;
