import { useEffect, useState } from "react";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { STORAGE } from "../firebaseConfig";

const fetchImagesFromCollection = (UID, collectionName) => {
  const [imageList, setImageList] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        if (UID && collectionName) {
          const folderPath = `images/${UID}/sheetCollections/${collectionName}`;
          const folderRef = ref(STORAGE, folderPath);

          const listResult = await listAll(folderRef);

          const urls = await Promise.all(
            listResult.items.map(async (itemRef) => {
              try {
                return await getDownloadURL(itemRef);
              } catch (error) {
                console.error("Error downloading image:", error);
                return null;
              }
            })
          );

          setImageList(urls.filter((url) => url !== null));
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, [UID, collectionName]);

  return imageList;
};

export default fetchImagesFromCollection;
