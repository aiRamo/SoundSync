import { compileNoteData } from "./compileNoteData";
import {
  uploadImage,
  getFirebaseDownloadURL,
  sendJSONToSheetCollection,
} from "./firebaseUtils";
import API_URL from "../API_URL.json";

export const callAPIandFormatNotesJSON = async (
  UID,
  image,
  collectionName,
  setters,
  data1,
  dispatch1,
  data2,
  dispatch2
) => {
  try {
    setters.setPreviewVisible(true);
    await uploadImage(image, UID);
    setters.setLoading(true);

    const UPDATE_DATA1 = "UPDATE_DATA1";
    const UPDATE_DATA2 = "UPDATE_DATA2";

    // Inside your function
    const updateData = (newData, newData2) => {
      // Dispatch an action to update the JSON object
      dispatch1({ type: UPDATE_DATA1, payload: newData });
      dispatch2({ type: UPDATE_DATA2, payload: newData2 });
    };

    const data = {
      uid: UID, // This is the Firebase UID
      collectionName: collectionName, // This is the name of the collection
    };

    // Fetch API to send the UID
    const response = await fetch(API_URL.API_URL_UPLOAD, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const notesJson = await response.json();
      console.log("Notes JSON:", notesJson);

      setters.setNoteCoordinateData(notesJson.coordinateData);

      //const tableData = compileNoteData(notesJson);

      sendJSONToSheetCollection(
        notesJson.notes,
        collectionName,
        "noteData.json"
      );

      // Assume the firebasePath is returned in the JSON response from your API
      const firebasePath = notesJson.firebasePath; // notesJson.frebasePath represents the firebase file path that holds the preview png.

      const downloadURL = await getFirebaseDownloadURL(firebasePath);
      console.log(downloadURL);

      // console.log(
      //   "here coordinate data: " + JSON.stringify(notesJson.coordinateData)
      // );
      updateData(notesJson, downloadURL);
      setters.setpngURL(downloadURL);
    } else {
      console.log("API call failed:", response.statusText);
    }
  } catch (error) {
    console.error("Error calling API:", error);
  } finally {
    setters.setLoading(false); // Hide loading circle
    setters.setDoneLoading(true);
  }
};
