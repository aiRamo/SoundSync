import React, { useEffect, useState } from "react";
import {
  Image,
  View,
  ScrollView,
  Modal,
  TouchableOpacity,
  Text,
} from "react-native";
import { BlurView } from "expo-blur";
import { useImage } from "@shopify/react-native-skia";

import * as ImagePicker from "expo-image-picker";

import useWebSocket from "../useWebSocket";

// fetchImagesFromCollection.js returns a list of the given images in a certain collection's directory.
// This is done by passing in the UID and collectionName from Scan.js
import fetchImagesFromCollection from "../fetchImagesFromCollection";

// callAPIAndFormatNotesJSON.js handles the client-server communication between the app and the API.
// The API response data is returned back to this page and bundled together to be sent to scannerModalContent.js
// the 'image' state is used to provide the input photo to the API via Firebase. 'pngURL' is the actual photo created afterwards.
import { callAPIandFormatNotesJSON } from "../callAPIAndFormatNotesJSON";

// scannerModalContent.js is responsible for displaying all data to the user.
// This includes noteCoordinateData (JSON) and pngURL (firebase address of output image).
// This is where all post-API functionality occurs, such as the creation and upload of the noteHighlighter data.
import ScannerModalContent from "./scannerModalContent";

// checkCurrentUser validates that user is logged in and returns the user's UID.
import { checkCurrentUser } from "../firebaseUtils";
import { useDataContext } from "../DataContext";
import { useDataContext2 } from "../DataContext2";

import styles from "../styleSheetScan";

const SheetScanPrompt = ({ collectionName, imgUrl }) => {
  //Boolean states - These 4 are used to control conditional rendering in the ScannerModal
  const [loading, setLoading] = useState(false);
  const [doneLoading, setDoneLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [trackerBoxesVisible, setTrackerBoxesVisible] = useState(false);

  const [image, setImage] = useState(require("../../assets/addScan.png"));
  const [pngURL, setpngURL] = useState(null);
  const [noteCoordinateData, setNoteCoordinateData] = useState(false);
  const [serverMessage, setServerMessage] = useState("Scanning Image");
  const [loadingPhase, setLoadingPhase] = useState("");
  const [UID, setUID] = useState(null);
  const { data1, dispatch1 } = useDataContext();
  const { data2, dispatch2 } = useDataContext2();

  const loadingImage = useImage(require("../../assets/SoundSyncIcon.png"));

  const settersForAPI = {
    setPreviewVisible,
    setLoading,
    setNoteCoordinateData,
    setpngURL,
    setDoneLoading,
  };

  const loadingDataForScannerModal = {
    loading,
    serverMessage,
    loadingPhase,
    loadingImage,
  };

  const doneLoadingDataForScannerModal = {
    doneLoading,
    pngURL,
    trackerBoxesVisible,
    noteCoordinateData,
    collectionName,
  };

  const actionsForScannerModal = {
    toggleTrackerBoxesVisible: () =>
      setTrackerBoxesVisible(!trackerBoxesVisible),
    togglePreviewVisibleAndDoneLoading: () => {
      setPreviewVisible(!previewVisible);
      setDoneLoading(!doneLoading);

      setServerMessage("Scanning image");
    },
  };

  useWebSocket((event) => setServerMessage(event.data));

  checkCurrentUser()
    .then((userId) => {
      setUID(userId);
    })
    .catch((error) => {
      console.log("No user signed in:", error);
    });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: undefined,
      quality: 1,
      base64: false,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // setLoadingPhase() is used to control the loading UI element's max height. Meant to simulate a progress bar.

  useEffect(() => {
    if (serverMessage == "Scanning image") {
      setLoadingPhase("bottom");
    } else if (serverMessage == "Gathering note data") {
      setLoadingPhase("middle");
    } else if (serverMessage == "Loading response data") {
      setLoadingPhase("top");
    } else {
      setLoadingPhase("bottom");
    }
  }, [serverMessage]);

  useEffect(() => {
    if (imgUrl != null) {
      console.log(imgUrl);
      setImage(imgUrl);
    }
  }, [imgUrl]);

  const imageList = fetchImagesFromCollection(UID, collectionName);

  const callAPIandWaitForResponse = async () => {
    await callAPIandFormatNotesJSON(
      UID,
      image,
      collectionName,
      settersForAPI,
      data1,
      dispatch1,
      data2,
      dispatch2
    );
  };

  const [contentHeight, setContentHeight] = useState(0);

  return (
    <View style={styles.content}>
      <Text style={styles.introTitle}> Next, Choose Your Image</Text>
      <ScrollView
        style={[styles.imageList, { height: contentHeight }]}
        contentContainerStyle={{ alignItems: "center" }}
        horizontal={true}
      >
        <View
          onLayout={(event) => {
            const { height } = event.nativeEvent.layout;
            setContentHeight(height);
          }}
          style={{ flexDirection: "row" }}
        >
          <TouchableOpacity
            onPress={pickImage}
            z
            style={styles.pickImageButtonContainer}
          >
            {image == require("../../assets/addScan.png") && (
              <Image source={image} style={styles.pickImageButtonImage} />
            )}

            {image != require("../../assets/addScan.png") && (
              <Image source={{ uri: image }} style={styles.imagePreview} />
            )}
          </TouchableOpacity>

          {imageList.map((url, index) => (
            <View key={index} style={styles.pickImageButtonContainer}>
              <Image source={{ uri: url }} style={styles.imagePreview} />
            </View>
          ))}
        </View>
      </ScrollView>

      {image != require("../../assets/addScan.png") && (
        <>
          <TouchableOpacity
            onPress={callAPIandWaitForResponse}
            style={styles.testButtonContainer}
          >
            <Text style={styles.openButtonText}>Confirm</Text>
          </TouchableOpacity>
        </>
      )}

      {/* PNG rendering */}
      {previewVisible && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={previewVisible}
          onRequestClose={() => {}}
        >
          {Platform.OS === "ios" ? (
            <BlurView intensity={15} style={styles.modalContainer}>
              <ScannerModalContent
                loadingData={loadingDataForScannerModal}
                doneLoadingData={doneLoadingDataForScannerModal}
                actions={actionsForScannerModal}
              />
            </BlurView>
          ) : (
            <View
              style={{
                ...styles.modalContainer,
                backgroundColor: "rgba(0, 0, 0, 0.85)",
              }}
            >
              <ScannerModalContent
                loadingData={loadingDataForScannerModal}
                doneLoadingData={doneLoadingDataForScannerModal}
                actions={actionsForScannerModal}
              />
            </View>
          )}
        </Modal>
      )}
    </View>
  );
};

export default SheetScanPrompt;
