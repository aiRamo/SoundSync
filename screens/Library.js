import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
} from "react-native";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { STORAGE } from "../firebaseConfig";
import Card from "../components/Card";
import { Entypo, AntDesign } from "@expo/vector-icons";

export default function Library() {
  const [imageUrls, setImageUrls] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredImageUrls = imageUrls.filter((imageUrl, index) =>
    `music page ${index}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          backgroundColor: "darkslateblue",
        }}
      >
        <View
          style={{
            marginTop: StatusBar.currentHeight,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TextInput
            placeholder="Search"
            placeholderTextColor="white"
            clearButtonMode="always"
            style={styles.search}
            onChangeText={(text) => setSearchQuery(text)}
          />
          <Entypo name="dots-three-vertical" size={24} color="white" />
        </View>
      </View>
      <View style={styles.container}>
        <View style={{ marginBottom: 10, flexDirection: "row" }}>
          <AntDesign name="filter" size={24} color="black" />
          <Text>Descending Order</Text>
        </View>
        <ScrollView>
          {filteredImageUrls.map((imageUrl, index) => (
            <Card
              key={index}
              imgeUrl={imageUrl}
              title={`music page ${index}`}
            ></Card>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  search: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    borderColor: "white",
    color: "white",
    marginBottom: 5,
    marginLeft: 10,
  },
});
