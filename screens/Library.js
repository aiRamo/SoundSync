import { View, Text, ScrollView, StatusBar, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { STORAGE } from "../firebaseConfig";
import Card from "../components/Card";
import { Ionicons } from "@expo/vector-icons";

export default function Library() {
  const [imageUrls, setImageUrls] = useState([]);
  let count = 0;

  useEffect(() => {
    async function listFilesInFolder(folderPath) {
      const folderRef = ref(STORAGE, folderPath);
      const listResult = await listAll(folderRef);
      const urls = await Promise.all(
        listResult.items.map(async (itemRef) => {
          try {
            const url = await getDownloadURL(itemRef);
            return url;
          } catch (error) {
            console.error("Error downloading image:", error);
            return null;
          }
        })
      );
      setImageUrls(urls.filter((url) => url !== null));
    }

    listFilesInFolder("images/eP42yMFVDcdvkwroV3OrFv4yutH2/BenTestFolder/");
  }, []);

  return (
    <View style={styles.container}>
      <View>
        <Ionicons name="filter-sharp" size={30} color="black" />
      </View>
      <ScrollView>
        {imageUrls.map((imageUrl, index) => (
          <Card
            key={index}
            imgeUrl={imageUrl}
            title={`music page ${count++}`}
          ></Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
    marginLeft: 10,
    marginRight: 10,
    marginTop: StatusBar.currentHeight,
  },
});
