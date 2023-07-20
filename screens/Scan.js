import React, { useState, useEffect } from "react";
import { Button, Image, View, Platform, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { initializeApp } from "firebase/app";
import { getFunctions, httpsCallable } from "firebase/functions";
import { firebaseConfig } from "../firebaseConfig";

const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);

export default function Scan() {
  let temp = "";
  const [holder, setHolder] = useState("");
  const [image, setImage] = useState(null);
  const [imageBlob, setImageBlob] = useState(null);
  const [inputFile, setInputFile] = useState(null);

  function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: false,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  useEffect(() => {
    if (image) {
      setImageBlob(dataURItoBlob(image));
    }
  }, [image]);

  useEffect(() => {
    if (imageBlob) {
      setInputFile(new File([imageBlob], "example.png", { type: "image/png" }));
      console.log("Successfully set Input File.");
    }
  }, [imageBlob]);

  const handleClick = async () => {
    try {
      const apiUrl = "http://192.168.86.50:3000/upload"; // Replace with your locally hosted API URL
      const formData = new FormData();
      formData.append("file", inputFile); // Use the 'file' variable instead of 'image'

      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const notesJson = await response.json();
        console.log("Notes JSON:", notesJson);

        for (var i = 0; i < notesJson.notes[0].notes.length; i++) {
          temp += notesJson.notes[0].notes[i].pitch[0].step[0];
          temp += notesJson.notes[0].notes[i].pitch[0].octave[0];
          temp += ",";
        }
        setHolder(temp);

        // Now you have the notes JSON, and you can process it further as needed.
      } else {
        console.log("API call failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button title="Pick image" onPress={pickImage} />
      <Button title="test" color="red" onPress={handleClick} />
      {image && (
        <Image source={{ uri: image }} style={{ height: 200, width: 600 }} />
      )}
      <Text>{holder}</Text>
    </View>
  );
}
