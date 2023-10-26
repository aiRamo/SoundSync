import React, { useState, useEffect, useRef } from "react";
import { ScrollView, View, Image, TouchableOpacity, Text } from "react-native";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { STORAGE } from "../firebaseConfig";
import { AUTH } from "../firebaseConfig";

export default function Test({ route }) {
  const [user, setUser] = useState(null);
  const [collection, setCollection] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [count, setCount] = useState(0);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    if (route.params != null) {
      const { subfolderName } = route.params;
      setCollection(subfolderName);
    }
  }, [route.params]);

  useEffect(() => {
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
              const fileName = itemRef.name.toLowerCase();

              if (!fileName.endsWith(".json")) {
                setCount((prevCount) => prevCount + 1);
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

  const startAutoScroll = () => {
    const scrollDuration = 2000;
    const scrollDistance = 500;
    let index = 0;

    console.log(count);
    let scrollPosition = 0;
    const scrollView = scrollViewRef.current;

    const contentHeight = imageUrls.length * 500;

    const scrollInterval = setInterval(() => {
      if (index < count) {
        scrollView.scrollTo({ y: scrollPosition, animated: true });
        scrollPosition += scrollDistance;
        index++;
      } else {
        clearInterval(scrollInterval);
      }
    }, scrollDuration);
  };

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        style={{
          borderRadius: 5,
          backgroundColor: "darkslateblue",
          padding: 10,
          marginBottom: 10,
          marginLeft: 50,
          marginRight: 50,
          marginTop: 10,
          alignItems: "center",
        }}
        onPress={startAutoScroll}
      >
        <Text style={{ color: "white" }}> Start Scrolling </Text>
      </TouchableOpacity>
      <ScrollView ref={scrollViewRef}>
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
