import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import styles from "../styleSheetScan"; // Replace with the actual path to your styles

import NoteHighlighter from "./noteHighligher";

const ScannerModalContent = ({
  serverMessage,
  doneLoading,
  setDoneLoading,
  pngURL,
  onChangeCollectionName,
  setScannerPhase,
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
            {/*<NoteHighlighter />*/}
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
                onChangeCollectionName("");
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
