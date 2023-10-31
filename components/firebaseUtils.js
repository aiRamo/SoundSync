import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  listAll,
} from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE, STORAGE, DB, AUTH } from "../firebaseConfig";

// make sure the path is correct
export const checkCurrentUser = async () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(AUTH, (user) => {
      if (user) {
        // User is signed in
        const id = user.uid;
        resolve(id);
      } else {
        // No user is signed in
        console.log("No user is signed in.");
        reject("No user is signed in.");
      }
      unsubscribe(); // Unsubscribe to the observer after resolving or rejecting
    });
  });
};

export const sendJSONToSheetCollection = async (
  JSONObject,
  collectionName,
  fileName
) => {
  try {
    // Get the current user's UID
    const UID = await checkCurrentUser();

    // Create a Blob from the JSON string
    const blob = new Blob([JSON.stringify(JSONObject)], {
      type: "application/json",
    });

    // Create a storage reference
    const storageRef = ref(
      STORAGE,
      `images/${UID}/sheetCollections/${collectionName}/${fileName}`
    );

    // Upload the Blob to Firebase Storage
    const uploadTask = await uploadBytesResumable(storageRef, blob);

    // Optionally, get the download URL if you need it
    const downloadURL = await getDownloadURL(uploadTask.ref);

    console.log(
      `JSON file uploaded successfully. Download URL: ${downloadURL}`
    );
  } catch (error) {
    console.error("An error occurred:", error);
    if (error.code) {
      console.error("Error code:", error.code);
    }
    if (error.message) {
      console.error("Error message:", error.message);
    }
    if (error.serverResponse) {
      console.error("Server response:", error.serverResponse);
    }
  }
};

export async function uploadImage(uri, uid) {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(STORAGE, `images/${uid}/inputFile/${uid}.jpg`);
    await uploadBytesResumable(storageRef, blob);
    console.log("Image uploaded successfully");
  } catch (error) {
    console.error("Error uploading image:", error);
  }
}

export async function getFirebaseDownloadURL(firebasePath) {
  const downloadURL = await getDownloadURL(ref(STORAGE, firebasePath));
  return downloadURL;
}

// Invoked by Tracker
// Retrieves the image and JSON files form Firebase Storage and returns them in 2 separate arrays

export const downloadAllItemsInCollection = async (collectionName) => {
  try {
    console.log("Starting downloadAllItemsInCollection function...");
    const UID = await checkCurrentUser();
    console.log("UID:", UID);

    const storageRef = ref(
      STORAGE,
      `images/${UID}/sheetCollections/${collectionName}`
    );
    //console.log("Storage Reference:", storageRef);

    // Fetch all the items (files) in the folder
    const res = await listAll(storageRef);
    //console.log("List All Response:", res);

    const downloadPromises = res.items.map(async (itemRef) => {
      const downloadURL = await getDownloadURL(itemRef);
      return downloadURL;
    });

    const downloadURLs = await Promise.all(downloadPromises);
    console.log("All Download URLs:", downloadURLs);

    //console.log("Download URLs:", downloadURLs);

    // Separate image URLs and JSON URLs
    const imageUrls = downloadURLs.filter((url) => !url.includes(".json"));
    const jsonUrls = downloadURLs.filter((url) => url.includes(".json"));
    //console.log("Image URLs:", imageUrls);
    //console.log("JSON URLs:", jsonUrls);

    // Sort JSON URLs based on file names
    const sortedJsonUrls = jsonUrls.sort((a, b) => {
      if (
        a.includes("notePositions.json") &&
        !b.includes("notePositions.json")
      ) {
        return -1;
      }
      if (
        !a.includes("notePositions.json") &&
        b.includes("notePositions.json")
      ) {
        return 1;
      }
      return 0;
    });
    //
    // Fetch JSON data from URLs
    const fetchJSONPromises = sortedJsonUrls.map(async (url) => {
      try {
        console.log("here the url " + url);
        const response = await fetch(url, {
          // headers: {
          // "Access-Control-Allow-Origin": "*",
          //},
          // mode: "cors",
          mode: "cors",
        });
        if (!response.ok) {
          throw new Error(`Fetch failed with status: ${response.status}`);
        }
        const data = await response.json();

        return data;
      } catch (error) {
        console.error("An error occurred while fetching JSON data:", error);
        return null; // or handle the error in an appropriate way
      }
    });

    const jsonData = await Promise.all(fetchJSONPromises);
    //console.log("JSON Data:", jsonData);

    // Return only the first image URL for testing
    const firstImageUrl = imageUrls.length > 0 ? imageUrls[0] : null;
    console.log("Image URL:", firstImageUrl);

    return {
      firstImageUrl,
      jsonData,
    };
  } catch (error) {
    console.error("An error occurred:", error);
    return null;
  }
};
