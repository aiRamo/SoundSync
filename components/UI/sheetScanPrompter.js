import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  View,
  ScrollView,
  Modal,
  Dimensions,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import renderNoteBoxes from "../renderNoteBoxes";
import WaveMeter from "./scannerLoader";
import { BlurView } from "expo-blur";
import { useImage } from "@shopify/react-native-skia";

import * as ImagePicker from "expo-image-picker";

import { compileNoteData } from "../compileNoteData";
import {
  checkCurrentUser,
  uploadImage,
  getFirebaseDownloadURL,
} from "../firebaseUtils";

import styles from "../styleSheetScan";

const { width, height } = Dimensions.get("window");
const A4_RATIO = 1.4;
const ViewWidth = width * 0.8; // 90% of device width
const ViewHeight = ViewWidth * A4_RATIO;

const SheetScanPrompt = ({ collectionName }) => {
  const [image, setImage] = useState(require("../../assets/addScan.png"));
  const [loading, setLoading] = useState(false);
  const [doneLoading, setDoneLoading] = useState(false);
  const [pngURL, setpngURL] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [trackerBoxesVisible, setTrackerBoxesVisible] = useState(false);
  const [noteCoordinateData, setNoteCoordinateData] = useState(false);
  const [serverMessage, setServerMessage] = useState(""); // New state for the server message
  const [loadingPhase, setLoadingPhase] = useState("");

  let id;
  let ws = useRef(null); // Reference for WebSocket

  const loadingImage = useImage(require("../../assets/SoundSyncIcon.png"));

  useEffect(() => {
    //192.168.86.41 -- B
    //192.168.1.238 -- A
    ws.current = new WebSocket("ws://192.168.86.33:4000"); // Replace with your WebSocket server URL

    ws.current.onopen = () => {
      console.log("WebSocket connection opened");
    };

    ws.current.onmessage = (event) => {
      setServerMessage(event.data);
    };

    ws.current.onerror = (error) => {
      console.log("WebSocket error:", error);
    };

    ws.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      ws.current.close();
    };
  }, []);

  // Call the function to check the current user's status
  checkCurrentUser()
    .then((userId) => {
      id = userId;
    })
    .catch((error) => {
      console.log("No user signed in:", error);
    });

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: undefined,
      quality: 1,
      base64: false,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);

      //firebase upload
    }
  };

  const callAPIandFormatNotesJSON = async () => {
    try {
      setPreviewVisible(true);
      await uploadImage(image, id);
      setLoading(true);

      //192.168.86.41 -- B
      //192.168.1.238 -- A
      const apiUrl = "http://192.168.86.33:3000/upload"; // Replace with your locally hosted API URL (ipv4)

      const data = {
        uid: id, // This is the Firebase UID
        collectionName: collectionName, // This is the name of the collection
      };

      // Fetch API to send the UID
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const notesJson = await response.json();
        console.log("Notes JSON:", notesJson);

        setNoteCoordinateData(notesJson.coordinateData);

        const tableData = compileNoteData(notesJson);

        // Assume the firebasePath is returned in the JSON response from your API
        const firebasePath = notesJson.firebasePath; // notesJson.frebasePath represents the firebase file path that holds the preview png.

        const downloadURL = await getFirebaseDownloadURL(firebasePath);
        setpngURL(downloadURL);
      } else {
        console.log("API call failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error calling API:", error);
    } finally {
      setLoading(false); // Hide loading circle
      setDoneLoading(true);
    }
  };

  useEffect(() => {
    if (noteCoordinateData) {
      console.log("Coordinates: " + JSON.stringify(noteCoordinateData));
    }
  }, [noteCoordinateData]);

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
        </View>
      </ScrollView>

      {image != require("../../assets/addScan.png") && (
        <>
          <TouchableOpacity
            onPress={callAPIandFormatNotesJSON}
            style={styles.testButtonContainer}
          >
            <Text style={styles.openButtonText}>Confirm</Text>
          </TouchableOpacity>

          {/*<Image
                source={{ uri: image }}
                style={styles.imagePreview}
                resizeMode="contain"
          />*/}
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
          <BlurView intensity={15} style={styles.modalContainer}>
            {loading && (
              <>
                <WaveMeter
                  externalPhase={loadingPhase}
                  image={loadingImage}
                  style={{ transform: [{ scale: 0.25 }] }}
                />
                {serverMessage && (
                  <Text style={styles.serverMessage}>{serverMessage}</Text>
                )}
              </>
            )}
            {doneLoading && (
              <>
                <Text style={styles.modalTitle}>
                  Here is your generated image
                </Text>
                <View style={styles.modalImageView}>
                  <Image source={{ uri: pngURL }} style={styles.previewImage} />
                  {trackerBoxesVisible &&
                    renderNoteBoxes(noteCoordinateData, ViewWidth, ViewHeight)}
                </View>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <TouchableOpacity
                    onPress={() => setTrackerBoxesVisible(!trackerBoxesVisible)}
                    style={styles.showNotesButton}
                  >
                    <Text style={styles.blueButtonText}>
                      Show Note Locations
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setPreviewVisible(!previewVisible);
                      setDoneLoading(!doneLoading);
                    }}
                    style={styles.closeButton}
                  >
                    <Text style={styles.redButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </BlurView>
        </Modal>
      )}
    </View>
  );
};

export default SheetScanPrompt;
