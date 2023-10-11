import React from "react";
import { View, Text, TouchableOpacity, Image, Dimensions } from "react-native";
import styles from "../styleSheetScan"; // Replace with the actual path to your styles

// calculateNoteCoordinates.js parses the noteCoordinateData JSON and returns a list of components representing the note's page location.
// These components are where the noteHighlighter comes from.
import calculateNoteCoordinates from "../calculateNoteCoordinates";
import WaveMeter from "./scannerLoader";

const { width, height } = Dimensions.get("window");
const A4_RATIO = 1.4;
const ViewWidth = width * 0.7; // 90% of device width
const ViewHeight = ViewWidth * A4_RATIO;

const ScannerModalContent = ({ loadingData, doneLoadingData, actions }) => {
  return (
    <>
      {loadingData.loading && (
        <>
          <WaveMeter
            externalPhase={loadingData.loadingPhase}
            image={loadingData.loadingImage}
            style={{ transform: [{ scale: 0.25 }] }}
          />
          {loadingData.serverMessage && (
            <Text style={styles.serverMessage}>
              {loadingData.serverMessage}
            </Text>
          )}
        </>
      )}
      {doneLoadingData.doneLoading && (
        <>
          <Text style={styles.modalTitle}>Here is your generated image</Text>
          <View style={styles.modalImageView}>
            <Image
              source={{ uri: doneLoadingData.pngURL }}
              style={styles.previewImage}
            />
            {doneLoadingData.trackerBoxesVisible &&
              calculateNoteCoordinates(
                doneLoadingData.noteCoordinateData,
                doneLoadingData.collectionName,
                ViewWidth,
                ViewHeight
              )}
          </View>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <TouchableOpacity
              onPress={actions.toggleTrackerBoxesVisible}
              style={styles.showNotesButton}
            >
              <Text style={styles.blueButtonText}>Show Note Locations</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={actions.togglePreviewVisibleAndDoneLoading}
              style={styles.closeButton}
            >
              <Text style={styles.redButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </>
  );
};

export default ScannerModalContent;
