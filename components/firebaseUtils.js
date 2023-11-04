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

function extractLeadingNumber(url) {
  const match = url.match(/^(\d+)/); // Regex to find leading numbers in a string
  return match ? parseInt(match[1], 10) : null;
}

async function fetchSortedJsonData(directoryPath, fileIdentifier) {
  const UID = await checkCurrentUser();
  const dirRef = ref(STORAGE, `${directoryPath}`);
  const res = await listAll(dirRef);

  // Map each itemRef to its download URL, then filter and sort them
  const jsonUrls = (
    await Promise.all(res.items.map((itemRef) => getDownloadURL(itemRef)))
  )
    .filter((url) => url.includes(fileIdentifier)) // Filter by file identifier
    .sort((a, b) => extractLeadingNumber(a) - extractLeadingNumber(b)); // Sort by leading numbers

  // Fetch JSON from URLs
  const jsonPromises = jsonUrls.map(async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP status ${response.status}`);
    }
    return response.json();
  });

  // Return a sorted array of JSON data
  return Promise.all(jsonPromises);
}

export const getCoordinateData = async (collectionName) => {
  const UID = await checkCurrentUser(); // Correctly scope UID within the function
  const coordinatePath = `images/${UID}/sheetCollections/${collectionName}/sheetCoordinateData`;
  return fetchSortedJsonData(coordinatePath, "coordinateData.json");
};

export const getNoteData = async (collectionName) => {
  const UID = await checkCurrentUser(); // Correctly scope UID within the function
  const notePath = `images/${UID}/sheetCollections/${collectionName}/sheetNoteData`;
  return fetchSortedJsonData(notePath, "noteData.json");
};

export const downloadAllItemsInCollection = async (collectionName) => {
  try {
    const UID = await checkCurrentUser();

    // Define paths for images, coordinate data, and note data
    const imagePath = `images/${UID}/sheetCollections/${collectionName}`;
    const coordinatePath = `${imagePath}/sheetCoordinateData`;
    const notePath = `${imagePath}/sheetNoteData`;

    // Fetch all images and sort them
    const imageRefs = await listAll(ref(STORAGE, `${imagePath}`));
    let imageUrls = (
      await Promise.all(
        imageRefs.items.map((itemRef) => getDownloadURL(itemRef))
      )
    ).sort((a, b) => extractLeadingNumber(a) - extractLeadingNumber(b)); // Sort by leading numbers

    // Fetch and sort JSON data for coordinates and notes
    const coordinateDataList = await getCoordinateData(collectionName); // Make sure this function uses UID correctly
    const noteDataList = await getNoteData(collectionName); // Make sure this function uses UID correctly

    // Return the combined and sorted data
    return {
      imageUrls, // Sorted array of image URLs
      coordinateDataList, // Sorted list of coordinate data JSON objects
      noteDataList, // Sorted list of note data JSON objects
    };
  } catch (error) {
    console.error(
      "An error occurred while downloading items in the collection:",
      error
    );
    return {
      imageUrls: [],
      coordinateDataList: [],
      noteDataList: [],
    };
  }
};
