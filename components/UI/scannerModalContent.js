import React from "react";
import { View, Text, TouchableOpacity, Image, Dimensions } from "react-native";
import styles from "../styleSheetScan"; // Replace with the actual path to your styles

// calculateNoteCoordinates.js parses the noteCoordinateData JSON and returns a list of components representing the note's page location.
// These components are where the noteHighlighter comes from.
import calculateNoteCoordinates from "../calculateNoteCoordinates";

const { width, height } = Dimensions.get("window");
const A4_RATIO = 1.4;
const ViewWidth = width * 0.26; // 90% of device width
const ViewHeight = ViewWidth * A4_RATIO;

const ScannerModalContent = ({
  serverMessage,
  doneLoading,
  pngURL,
  collectionName,
  noteCoordinateData,
}) => {
  React.useEffect(() => {
    console.log(pngURL);
  }, [pngURL]);

  return (
    <View style={{ height: "100vh" }}>
      {!doneLoading && <Text style={styles.modalTitle}>{serverMessage}</Text>}
      {doneLoading && (
        <>
          <Text style={styles.modalTitle}>Here is your generated image</Text>
          <View style={styles.modalImageView}>
            <Image source={{ uri: pngURL }} style={styles.previewImage} />
            {calculateNoteCoordinates(
              noteCoordinateData,
              collectionName,
              ViewWidth,
              ViewHeight
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
                console.log("Toggle Tracker Boxes Visible...");
              }}
              style={styles.showNotesButton}
            >
              <Text style={styles.blueButtonText}> Show Note Locations </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                console.log("Close...");
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
