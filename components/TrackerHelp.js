import { useEffect, useState } from "react";
import { getDownloadURL, listAll, ref } from "@firebase/storage";
import { STORAGE } from "../firebaseConfig";

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
  return { imageUrls, allCoord, allNote, allArray, count2 };
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
          const temp = step + octave;
          noteArray.push(temp);
        }
      }
    }
  }

  return noteArray;
}

export default FileList;
