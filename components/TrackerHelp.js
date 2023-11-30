import { useEffect, useState } from "react";
import { getDownloadURL, listAll, ref } from "@firebase/storage";
import { STORAGE } from "../firebaseConfig";
import { index } from "mathjs";

const FileList = (user, collectionName) => {
  const [imageUrls, setImageUrls] = useState([]);
  const [allCoord, setAllCoord] = useState(null);
  const [allNote, setAllNote] = useState(null);
  const [allArray, setAllArray] = useState(null);
  const [count2, setCount] = useState(0);

  useEffect(() => {
    async function listFilesInFolder(folderPath) {
      try {
        // Your existing code here...
        const JsonPath = folderPath + "/sheetNoteData";
        const JsonCoord = folderPath + "/sheetCoordinateData";

        const folderRef = ref(STORAGE, folderPath);
        const folderRef2 = ref(STORAGE, JsonPath);
        const folderRef3 = ref(STORAGE, JsonCoord);

        const listResult = await listAll(folderRef);
        const listResult2 = await listAll(folderRef2);
        const listResult3 = await listAll(folderRef3);

        const urls = await Promise.all(
          listResult.items.map(async (itemRef) => {
            try {
              const fileName = itemRef.name.toLowerCase();
              setCount((prevCount) => prevCount + 1);
              const url = await getDownloadURL(itemRef);

              return url;
            } catch (error) {
              console.error("Error downloading image:", error);
              return null;
            }
          })
        );
        setImageUrls(urls.filter((url) => url !== null));
        //json note data
        const jsonNoteData = await Promise.all(
          listResult2.items.map(async (itemRef) => {
            try {
              const url = await getDownloadURL(itemRef);
              const response = await fetch(url);
              const jsonData = await response.json();

              return jsonData;
            } catch (error) {
              console.error(
                "Error getting JSON data for",
                itemRef.name,
                ":",
                error
              );
              return null;
            }
          })
        );
        //json coordinate data
        const jsonCoordData = await Promise.all(
          listResult3.items.map(async (itemRef) => {
            try {
              const url = await getDownloadURL(itemRef);
              const response = await fetch(url);
              const jsonData = await response.json();

              return jsonData;
            } catch (error) {
              console.error(
                "Error getting JSON data for",
                itemRef.name,
                ":",
                error
              );
              return null;
            }
          })
        );

        setImageUrls(urls.filter((url) => url !== null));
        setAllCoord(jsonCoordData);
        setAllNote(jsonNoteData);

        let arrays = [];
        for (let i = 0; i < jsonNoteData.length; i++) {
          const retrievedNoteArray = await retrieve(jsonNoteData[i]);
          arrays.push(retrievedNoteArray);
        }
        setAllArray(arrays);
      } catch (error) {
        console.error("Error listing files in folder:", error);
      }
    }

    if (user && collectionName) {
      listFilesInFolder(
        `images/${user.uid}/sheetCollections/${collectionName}`
      );
    }
  }, [user, collectionName]);

  // Return the variables you want to access in other components
  return {
    imageUrls,
    allCoord,
    allNote,
    allArray,
    count2,
  };
};

// Return the noteArray
export async function retrieve(array) {
  let noteArray = [];
  for (const part of array) {
    for (const note of part.notes) {
      if (note.rest) {
        for (const rest of note.rest) {
          const step = rest["display-step"];
          const octave = rest["display-octave"];
          const temp = step + octave;
          noteArray.push(temp);
        }
      } else {
        for (const pitch of note.pitch) {
          const step = pitch.step[0];
          const octave = pitch.octave[0];
          let accidental = "";
          if (pitch.alter) {
            const alter = Number(pitch.alter[0]); // assuming alter is a string that can be converted to a number
            if (alter === -1) {
              accidental = "b";
            } else if (alter === 1) {
              accidental = "#";
            }
          }
          const noteType = note.type[0]; // Get the note type
          const temp = [step + accidental + octave, noteType]; // Create a tuple of note and type
          noteArray.push(temp);
        }
      }
    }
  }

  return noteArray;
}

export const getDurationForNoteType = (noteType, tempoBpm) => {
  const beatDurationMs = 60000 / tempoBpm; // Duration of a single beat in ms
  switch (noteType) {
    case "whole":
      return beatDurationMs * 4; // Whole note is four beats
    case "half":
      return beatDurationMs * 2; // Half note is two beats
    case "quarter":
      return beatDurationMs; // Quarter note is one beat
    case "eighth":
      return beatDurationMs / 2; // Eighth note is half a beat
    case "sixteenth":
      return beatDurationMs / 4; // Sixteenth note is a quarter beat
    // Add more cases for different note types if necessary
    default:
      return 0; // For rest or unrecognized note type
  }
};

export default FileList;
