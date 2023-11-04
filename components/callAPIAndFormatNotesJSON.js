import { compileNoteData } from "./compileNoteData";
import {
  uploadImage,
  getFirebaseDownloadURL,
  sendJSONToSheetCollection,
} from "./firebaseUtils";
// calculateNoteCoordinates.js parses the noteCoordinateData JSON and returns a list of components representing the note's page location.
// These components are where the noteHighlighter comes from.
import API_URL from "../API_URL.json";

import calculateNoteCoordinates from "./calculateNoteCoordinates";

export const callAPIandFormatNotesJSON = async (
  image,
  imageNumber,
  APIPayload
) => {
  try {
    await uploadImage(image, APIPayload.UID);

    const data = {
      uid: APIPayload.UID, // This is the Firebase UID
      collectionName: APIPayload.collectionName, // This is the name of the collection
      imageNumber: imageNumber, // This is the index number for the imageList
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

      calculateNoteCoordinates(
        notesJson.coordinateData,
        APIPayload.collectionName,
        imageNumber,
        APIPayload.ViewWidth,
        APIPayload.ViewHeight
      );

      //const tableData = compileNoteData(notesJson);

      sendJSONToSheetCollection(
        notesJson.notes,
        APIPayload.collectionName,
        `sheetNoteData/${imageNumber}noteData.json`
      );

      // Assume the firebasePath is returned in the JSON response from your API
      const firebasePath = notesJson.firebasePath; // notesJson.frebasePath represents the firebase file path that holds the preview png.

      const downloadURL = await getFirebaseDownloadURL(firebasePath);
      console.log(downloadURL);

      // console.log(
      //   "here coordinate data: " + JSON.stringify(notesJson.coordinateData)
      // );
      APIPayload.setpngURL(downloadURL);
    } else {
      console.log("API call failed:", response.statusText);
    }
  } catch (error) {
    console.error("Error calling API:", error);
  } finally {
  }
};
