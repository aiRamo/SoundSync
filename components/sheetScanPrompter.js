import React, { useEffect, useState } from "react";

import { useImage } from "@shopify/react-native-skia";

import * as ImagePicker from "expo-image-picker";

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

const SheetScanPrompt = ({
  collectionName,
  imgUrl,
  setScannerPhase,
  setDoneLoading,
  setpngURL,
  setNoteCoordinateData,
}) => {
  //Boolean states - These 4 are used to control conditional rendering in the ScannerModal
  const [loading, setLoading] = useState(false);

  const [image, setImage] = useState(require("../assets/addScan.png"));
  const [imageList, setImageList] = useState([]);
  const [loadingPhase, setLoadingPhase] = useState("");
  const [UID, setUID] = useState(null);

  const settersForAPI = {
    setLoading,
    setNoteCoordinateData,
    setpngURL,
  };

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

  const callAPIandWaitForResponse = async () => {
    let count = 0;
    let imageListSize = imageList.length;

    for (let img of imageList) {
      // Call the API for each image and await the response
      console.log(imageList[0]);
      console.log(UID);
      console.log(collectionName);
      console.log(settersForAPI);
      count += 1;
      await callAPIandFormatNotesJSON(
        UID,
        imageList[0],
        collectionName,
        settersForAPI
      );

      // Optional: Add a delay between API calls if needed
      // await new Promise(resolve => setTimeout(resolve, 1000));
    }
    //setLoading(false); // Hide loading circle
    setDoneLoading(true);
  };

  return (
    <SheetScanPromptContent
      image={image}
      setImage={setImage}
      pickImage={pickImage}
      imageList={imageList}
      setScannerPhase={setScannerPhase}
      callAPIandWaitForResponse={callAPIandWaitForResponse}
    />
  );
};

export default SheetScanPrompt;
