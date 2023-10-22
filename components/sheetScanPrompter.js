import React, { useEffect, useState } from "react";

import { useImage } from "@shopify/react-native-skia";

import * as ImagePicker from "expo-image-picker";

import useWebSocket from "./useWebSocket";

import SheetScanPromptContent from "./UI/sheetScanPrompterContent";

// fetchImagesFromCollection.js returns a list of the given images in a certain collection's directory.
// This is done by passing in the UID and collectionName from Scan.js
import fetchImagesFromCollection from "./fetchImagesFromCollection";

// callAPIAndFormatNotesJSON.js handles the client-server communication between the app and the API.
// The API response data is returned back to this page and bundled together to be sent to scannerModalContent.js
// the 'image' state is used to provide the input photo to the API via Firebase. 'pngURL' is the actual photo created afterwards.
import { callAPIandFormatNotesJSON } from "./callAPIAndFormatNotesJSON";

// checkCurrentUser validates that user is logged in and returns the user's UID.
import { checkCurrentUser } from "./firebaseUtils";

const SheetScanPrompt = ({ collectionName, imgUrl }) => {
  //Boolean states - These 4 are used to control conditional rendering in the ScannerModal
  const [loading, setLoading] = useState(false);
  const [doneLoading, setDoneLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [trackerBoxesVisible, setTrackerBoxesVisible] = useState(false);

  const [image, setImage] = useState(require("../assets/addScan.png"));
  const [imageList, setImageList] = useState([]);
  const [pngURL, setpngURL] = useState(null);
  const [noteCoordinateData, setNoteCoordinateData] = useState(false);
  const [serverMessage, setServerMessage] = useState("Scanning Image");
  const [loadingPhase, setLoadingPhase] = useState("");
  const [UID, setUID] = useState(null);

  const loadingImage = useImage(require("../assets/SoundSyncIcon.png"));

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

  useEffect(() => {
    // Check if the image is not already in the imageList and is not the default image
    if (
      image !== require("../assets/addScan.png") &&
      !imageList.includes(image)
    ) {
      setImageList((prevList) => [...prevList, image]);
    }
  }, [image]);

  //TODO: convert callAPIandWaitForResponse to run callAPIandFormatNotesJSON for each IMAGE in imageList INSTEAD of just the IMAGE in image.
  // We will need to wait for each response, either succesful or failed, before moving onto the NEXT image.

  const callAPIandWaitForResponse = async () => {
    for (let img of imageList) {
      // Call the API for each image and await the response
      await callAPIandFormatNotesJSON(UID, img, collectionName, settersForAPI);

      // Optional: Add a delay between API calls if needed
      // await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setLoading(false); // Hide loading circle
    setDoneLoading(true);
  };

  return (
    <SheetScanPromptContent
      image={image}
      pickImage={pickImage}
      imageList={imageList}
      callAPIandWaitForResponse={callAPIandWaitForResponse}
      previewVisible={previewVisible}
      loadingDataForScannerModal={loadingDataForScannerModal}
      doneLoadingDataForScannerModal={doneLoadingDataForScannerModal}
      actionsForScannerModal={actionsForScannerModal}
    />
  );
};

export default SheetScanPrompt;
