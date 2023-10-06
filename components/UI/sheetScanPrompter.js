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
import fetchImagesFromCollection from "../fetchImagesFromCollection";
import { callAPIandFormatNotesJSON } from "../callAPIAndFormatNotesJSON";
import ScannerModalContent from "./scannerModalContent";
import { checkCurrentUser } from "../firebaseUtils";

import styles from "../styleSheetScan";

const SheetScanPrompt = ({ collectionName, imgUrl }) => {
  const [image, setImage] = useState(require("../../assets/addScan.png"));
  const [loading, setLoading] = useState(false);
  const [doneLoading, setDoneLoading] = useState(false);
  const [pngURL, setpngURL] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [trackerBoxesVisible, setTrackerBoxesVisible] = useState(false);
  const [noteCoordinateData, setNoteCoordinateData] = useState(false);
  const [serverMessage, setServerMessage] = useState("Scanning Image");
  const [loadingPhase, setLoadingPhase] = useState("");
  const [UID, setUID] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

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
    await callAPIandFormatNotesJSON(UID, image, collectionName, settersForAPI);
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
