import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
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
