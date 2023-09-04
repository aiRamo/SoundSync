import React, { useState, useEffect } from "react";
import { Button, Image, View, ScrollView, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { FIREBASE, STORAGE, DB, AUTH } from "../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";
import { Buffer } from "buffer";

export default function Scan() {
  const [holder, setHolder] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  let id;

  const checkCurrentUser = async () => {
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(AUTH, (user) => {
        if (user) {
          // User is signed in
          id = user.uid;
          resolve(id);
        } else {
          // No user is signed in
          console.log("No user is signed in.");
          reject("No user is signed in.");
        }
        unsubscribe(); // Unsubscribe to the observer after resolving or rejecting
      });
    });
  };

  // Call the function to check the current user's status
  checkCurrentUser();

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: undefined,
      quality: 1,
      base64: false,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      
      //firebase upload
    }
  };

  //firebase upload
  async function uploadImage(uri) {
    try {
      // Upload the image to Firebase Storage
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(STORAGE, `images/${id}/inputFile/${id}.jpg`);
      await uploadBytesResumable(storageRef, blob);

      console.log("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  }

  const handleClick = async () => {
    try {

      await uploadImage(image);
      setLoading(true);

      //192.168.86.41 -- B
      //192.168.1.238 -- A
      const apiUrl = "http://192.168.1.238:3000/upload"; // Replace with your locally hosted API URL

      const data = {
        uid: id // This is the Firebase UID
      };

      // Fetch API to send the UID
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const notesJson = await response.json();
        console.log("Notes JSON:", notesJson);

        // Create an array to hold the table data
        const tableData = [
          [
            "Note Number",
            "Pitch",
            "Type",
            "Staff Number",
            "Chord",
            "Dot",
            "Measure Number",
          ],
        ];
        let count = 0;
        // Iterate through the notes and add their attributes to the table data array
        notesJson.notes.forEach((measure) => {
          measure.notes.forEach((note) => {
            const pitch = note.pitch ? note.pitch[0] : "";
            const type = note.rest ? "rest" : note.type ? note.type[0] : "";
            const staffNumber = note.staff ? note.staff[0] : "";
            const hasChord = note.chord ? "chord" : "";
            const hasDot = note.dot ? "dot" : "";
            const measureNumber = measure.number;
            if (note.pitch) {
              tableData.push([
                ++count,
                `${pitch.step[0]}${pitch.octave[0]}`,
                type,
                staffNumber,
                hasChord,
                hasDot,
                measureNumber,
              ]);
            } else {
              tableData.push([
                ++count,
                "",
                type,
                staffNumber,
                hasChord,
                hasDot,
                measureNumber,
              ]);
            }
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
      <ScrollView style={{ width: "100%" }}>
        <View style={{ width: "30%", alignSelf: "center", marginBottom: 10 }}>
          <Button title="Pick image" onPress={pickImage} />
        </View>

        {image && (
          <>
            <View
              style={{ width: "30%", alignSelf: "center", marginBottom: 10 }}
            >
              <Button title="test" color="red" onPress={handleClick} />
            </View>

            <Image
              source={{ uri: image }}
              style={{ height: 200, width: "100%", alignSelf: "center" }}
              resizeMode="contain"
            />
          </>
        )}

        {loading && (
          <Image
            source={require("../assets/loader.gif")}
            style={{ height: 50, width: 50, alignSelf: "center" }}
          />
        )}

        {Array.isArray(holder) && (
          <View style={{ marginVertical: 20, alignSelf: "left" }}>
            {holder.map((row, rowIndex) => (
              <View key={rowIndex} style={{ flexDirection: "row" }}>
                {row.map((cell, cellIndex) => (
                  <View
                    key={`${rowIndex}-${cellIndex}`}
                    style={{
                      borderWidth: 1,
                      padding: 5, // increased padding for readability
                      flex:
                        cellIndex === 6 ||
                        cellIndex === 3 ||
                        cellIndex === 2 ||
                        cellIndex === 0
                          ? 3
                          : 2, // Make the first column wider
                      minWidth: 50,  // minimum width for each cell
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
