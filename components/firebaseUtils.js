import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  uploadString,
} from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE, STORAGE, DB, AUTH } from "../firebaseConfig"; // make sure the path is correct

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

export const sendNoteCoordinatesToSheetCollection = async (
  notePositionsJSON,
  collectionName
) => {
  try {
    // Get the current user's UID
    const UID = await checkCurrentUser();

    // Create a Blob from the JSON string
    const blob = new Blob([JSON.stringify(notePositionsJSON)], {
      type: "application/json",
    });

    // Create a storage reference
    const storageRef = ref(
      STORAGE,
      `images/${UID}/sheetCollections/${collectionName}/notePositions.json`
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
