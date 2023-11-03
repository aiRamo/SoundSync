import { initializeApp } from "firebase/app";
import { getAuth, browserLocalPersistence } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyAC1xXs571iwIs4J9a4lpZmZlrHA4ZQMIU",
  authDomain: "soundsync-sd.firebaseapp.com",
  databaseURL: "https://soundsync-sd-default-rtdb.firebaseio.com",
  projectId: "soundsync-sd",
  storageBucket: "soundsync-sd.appspot.com",
  messagingSenderId: "725887284713",
  appId: "1:725887284713:web:68a3cc121d6ef41ea44778",
  measurementId: "G-KHNP3S9KHR",
};

export const FIREBASE = initializeApp(firebaseConfig);
export const AUTH = getAuth(FIREBASE);
export const STORAGE = getStorage(FIREBASE);
export const DB = getFirestore(FIREBASE);
