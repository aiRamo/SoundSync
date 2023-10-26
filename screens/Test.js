import React, { useState, useEffect } from "react";
import { ScrollView, View, Image } from "react-native";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { STORAGE } from "../firebaseConfig";
import { AUTH } from "../firebaseConfig";

export default function Test({ navigation, route }) {
  const [user, setUser] = useState(null);
  const [collection, setCollection] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    if (route.params != null) {
      const { subfolderName } = route.params;
      setCollection(subfolderName);
    }
  }, [route.params]);

  useEffect(() => {
    // Check for user authentication status on component mount
    const unsubscribe = AUTH.onAuthStateChanged((authUser) => {
      if (authUser) {
        // User is signed in
        setUser(authUser);
      } else {
        // User is signed out
        setUser(null);
      }
    });

    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function listFilesInFolder(folderPath) {
      try {
        const folderRef = ref(STORAGE, folderPath);
        const listResult = await listAll(folderRef);
        const urls = await Promise.all(
          listResult.items.map(async (itemRef) => {
            try {
              // Check the file extension to determine if it's an image
              const fileName = itemRef.name.toLowerCase();

              if (!fileName.endsWith(".json")) {
                const url = await getDownloadURL(itemRef);
                return url;
              }
            } catch (error) {
              console.error("Error downloading image:", error);
              return null;
            }
          })
        );
        setImageUrls(urls.filter((url) => url !== null));
      } catch (error) {
        console.error("Error listing files in folder:", error);
      }
    }

    if (user && collection) {
      listFilesInFolder(`images/${user.uid}/sheetCollections/${collection}`);
    }
  }, [user, collection]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <View
          style={{
            flexDirection: "column",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {imageUrls.map((url, index) => (
            <Image
              key={index}
              source={{ uri: url }}
              onError={(error) => {
                console.log("Image failed to load:", error);
                // You can add an error message to the component state
                // to display a message to the user.
              }}
              style={{ width: 500, height: 500, resizeMode: "contain" }}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
