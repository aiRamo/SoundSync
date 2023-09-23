import { compileNoteData } from "./compileNoteData";
import { uploadImage, getFirebaseDownloadURL } from "./firebaseUtils";
import API_URL from "../API_URL.json";

export const callAPIandFormatNotesJSON = async (
  UID,
  image,
  collectionName,
  setters
) => {
  try {
    setters.setPreviewVisible(true);
    await uploadImage(image, UID);
    setters.setLoading(true);

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

      const tableData = compileNoteData(notesJson);

      // Assume the firebasePath is returned in the JSON response from your API
      const firebasePath = notesJson.firebasePath; // notesJson.frebasePath represents the firebase file path that holds the preview png.

      const downloadURL = await getFirebaseDownloadURL(firebasePath);
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
