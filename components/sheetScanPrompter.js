import React, { useEffect, useState } from "react";

import { Dimensions } from "react-native";

import * as ImagePicker from "expo-image-picker";

import SheetScanPromptContent from "./UI/sheetScanPrompterContent";

// callAPIAndFormatNotesJSON.js handles the client-server communication between the app and the API.
// The API response data is returned back to this page and bundled together to be sent to scannerModalContent.js
// the 'image' state is used to provide the input photo to the API via Firebase. 'pngURL' is the actual photo created afterwards.
import { callAPIandFormatNotesJSON } from "./callAPIAndFormatNotesJSON";

// checkCurrentUser validates that user is logged in and returns the user's UID.
import { checkCurrentUser } from "./firebaseUtils";

const { width, height } = Dimensions.get("window");
const A4_RATIO = 1.4;

const ViewHeight = height * 0.8; // Control Sizing Here

const ViewWidth = ViewHeight / A4_RATIO;

const SheetScanPrompt = ({
  collectionName,
  imgUrl,
  setScannerPhase,
  setDoneLoading,
  setpngURL,
}) => {
  //Boolean states - These 4 are used to control conditional rendering in the ScannerModal
  let count = 0;
  const [image, setImage] = useState(require("../assets/addScan.png"));
  const [imageList, setImageList] = useState([]);
  const [UID, setUID] = useState(null);

  const APIPayload = {
    collectionName,
    setpngURL,
    ViewHeight,
    ViewWidth,
    UID,
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
    for (let i = 0; i < imageList.length; i++) {
      count = i;
      let img = imageList[i];
      console.log(img); // Current image
      console.log(UID); // Assuming UID is defined elsewhere
      console.log(collectionName); // Assuming collectionName is defined elsewhere

      await callAPIandFormatNotesJSON(
        img,
        i, // This is the index number for the current image
        APIPayload
      );

      // Optional: Add a delay between API calls if needed
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    setDoneLoading(true); // Assuming setDoneLoading is a state setter function defined elsewhere
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
