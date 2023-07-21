import React, { useState, useEffect } from "react";
import { Button, Image, View, ScrollView, Text } from "react-native";
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
  const [loading, setLoading] = useState(false);

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
      setLoading(true);

      const apiUrl = "http://192.168.208.1:3000/upload"; // Replace with your locally hosted API URL
      const formData = new FormData();
      formData.append("file", inputFile); // Use the 'file' variable instead of 'image'

      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const notesJson = await response.json();
        console.log("Notes JSON:", notesJson);
  
        // Create an array to hold the table data
        const tableData = [
          ["Num", "Pitch", "Type", "Staff Number", "Chord", "Dot", "Measure Number"],
        ];
        let count = 0;
        // Iterate through the notes and add their attributes to the table data array
        notesJson.notes.forEach((measure) => {
          measure.notes.forEach((note) => {
            const pitch = note.pitch[0];
            const type = note.type[0];
            const staffNumber = note.staff[0] ? note.staff[0]: "";
            const hasChord = note.chord ? "chord" : "";
            const hasDot = note.dot ? "dot" : "";
            const measureNumber = measure.number;
            tableData.push([++count, `${pitch.step[0]}${pitch.octave[0]}`, type, staffNumber, hasChord, hasDot, measureNumber]);
          });
        });
  
        // Update the state with the table data
        setHolder(tableData);
      } else {
        console.log("API call failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error calling API:", error);
    } finally {
      setLoading(false); // Hide loading circle
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ScrollView style={{ width: '100%' }}>
        <View style={{ width: '30%', alignSelf: 'center', marginBottom: 10}}>
          <Button title="Pick image" onPress={pickImage} />
        </View>
        <View style={{ width: '30%', alignSelf: 'center' , marginBottom: 10}}>
          <Button title="test" color="red" onPress={handleClick} />
        </View>
    
        {image && (
          <Image
            source={{ uri: image }}
            style={{ height: 200, width: 600, alignSelf: 'center' }}
            resizeMode="contain"
          />
        )}

        {loading && <Image source={require('../assets/loader.gif')} style={{ height: 50, width: 50, alignSelf: 'center' }} />}
    
        {Array.isArray(holder) && (
          <View style={{ marginVertical: 20 , alignSelf: 'center'}}>
            {holder.map((row, rowIndex) => (
              <View key={rowIndex} style={{ flexDirection: "row" }}>
                {row.map((cell, cellIndex) => (
                  <View
                    key={`${rowIndex}-${cellIndex}`}
                    style={{
                      borderWidth: 1,
                      padding: 1,
                      flex: cellIndex === 6 || cellIndex === 3 || cellIndex === 2  ? 3 : 2, // Make the first column wider
                    }}
                  >
                    <Text>{cell}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
