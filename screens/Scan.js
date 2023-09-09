import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Image,
  View,
  ScrollView,
  Modal,
  Dimensions,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import renderNoteBoxes from "../components/renderNoteBoxes";
import { compileNoteData } from "../components/compileNoteData";
import {
  checkCurrentUser,
  uploadImage,
  getFirebaseDownloadURL,
} from "../components/firebaseUtils";

const { width } = Dimensions.get("window");
const A4_RATIO = 1.4;
const ViewWidth = width * 0.82; // 90% of device width
const ViewHeight = ViewWidth * A4_RATIO;

export default function Scan() {
  const [holder, setHolder] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pngURL, setpngURL] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [trackerBoxesVisible, setTrackerBoxesVisible] = useState(false);
  const [noteCoordinateData, setNoteCoordinateData] = useState(false);
  const [serverMessage, setServerMessage] = useState(""); // New state for the server message

  let id;
  let ws = useRef(null); // Reference for WebSocket

  useEffect(() => {
    ws.current = new WebSocket("ws://192.168.1.238:4000"); // Replace with your WebSocket server URL

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
      await uploadImage(image, id);
      setLoading(true);

      //192.168.86.41 -- B
      //192.168.1.238 -- A
      const apiUrl = "http://192.168.1.238:3000/upload"; // Replace with your locally hosted API URL

      const data = {
        uid: id, // This is the Firebase UID
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

        // Update the state with the table data
        setHolder(tableData);

        // Assume the firebasePath is returned in the JSON response from your API
        const firebasePath = notesJson.firebasePath; // notesJson.frebasePath represents the firebase file path that holds the preview png.

        const downloadURL = await getFirebaseDownloadURL(firebasePath);
        setpngURL(downloadURL);
        setPreviewVisible(true);
      } else {
        console.log("API call failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error calling API:", error);
    } finally {
      setLoading(false); // Hide loading circle
    }
  };

  useEffect(() => {
    if (noteCoordinateData) {
      console.log("Coordinates: " + JSON.stringify(noteCoordinateData));
    }
  }, [noteCoordinateData]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.pickImageButtonContainer}>
          <Button title="Pick image" onPress={pickImage} />
        </View>

        {image && (
          <>
            <View style={styles.testButtonContainer}>
              <Button
                title="test"
                color="red"
                onPress={callAPIandFormatNotesJSON}
              />
            </View>

            <Image
              source={{ uri: image }}
              style={styles.imagePreview}
              resizeMode="contain"
            />
          </>
        )}

        {loading && (
          <>
            <Image
              source={require("../assets/loader.gif")}
              style={styles.loader}
            />
            {serverMessage && (
              <Text style={styles.serverMessage}>{serverMessage}</Text>
            )}
          </>
        )}

        {pngURL && (
          <TouchableOpacity
            onPress={() => setPreviewVisible(!previewVisible)}
            style={styles.openButton}
          >
            <Text style={styles.openButtonText}>Open</Text>
          </TouchableOpacity>
        )}

        {/* PNG rendering */}
        {previewVisible && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={previewVisible}
            onRequestClose={() => {}}
          >
            <View style={styles.modalContainer}>
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
                  <Text style={styles.blueButtonText}>Show Note Locations</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setPreviewVisible(!previewVisible)}
                  style={styles.closeButton}
                >
                  <Text style={styles.redButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    width: "100%",
  },
  pickImageButtonContainer: {
    width: "30%",
    alignSelf: "center",
    marginBottom: 10,
  },
  testButtonContainer: {
    width: "30%",
    alignSelf: "center",
    marginBottom: 10,
  },
  imagePreview: {
    height: 200,
    width: "100%",
    alignSelf: "center",
  },
  loader: {
    marginTop: 20,
    height: 50,
    width: 50,
    alignSelf: "center",
  },
  serverMessage: {
    fontSize: 35,
    color: "black",
    textAlign: "center",
    marginVertical: 10,
  },
  modalContainer: {
    flex: 1,
    height: "90%",
    width: "90%",
    borderRadius: 15,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(79, 90, 129, 0.73)",
  },
  modalTitle: {
    fontSize: 35,
    fontWeight: "600",
    color: "#F4F5FF",
    textAlign: "center",
    marginBottom: 25,
  },
  modalImageView: {
    height: ViewHeight,
    width: ViewWidth,
    backgroundColor: "rgba(0,0,0,0)",
  },
  previewImage: {
    height: ViewHeight,
    width: ViewWidth,
  },
  showNotesButton: {
    height: 30,
    width: 165,
    backgroundColor: "white",
    marginTop: 15,
    justifyContent: "center",
    borderRadius: 7,
    marginHorizontal: 15,
  },
  closeButton: {
    height: 30,
    width: 85,
    backgroundColor: "white",
    marginTop: 15,
    justifyContent: "center",
    borderRadius: 7,
    marginHorizontal: 15,
  },
  openButton: {
    height: 35,
    width: "30%",
    backgroundColor: "green",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 15,
  },
  openButtonText: {
    color: "white",
    fontWeight: 600,
    alignSelf: "center",
  },
  blueButtonText: {
    alignSelf: "center",
    fontSize: 15,
    fontWeight: "500",
    color: "blue", // Replace with your color
  },
  redButtonText: {
    alignSelf: "center",
    fontSize: 15,
    fontWeight: "500",
    color: "red", // Replace with your color
  },
});
