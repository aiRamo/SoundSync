import React, { useState, useEffect } from 'react';
import { Button, Image, View, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { firebaseConfig } from '../firebaseConfig'

const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);

export default function Scan() {
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

   

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  
  const handleClick = () => {
    // Invoke the Cloud Function

    const addMessage = httpsCallable(functions, 'helloWorld');
    addMessage()
    .then((result) => {
      console.log(result.data); // Should log "Hello from Firebase!"
    })
    .catch((error) => {
      console.error(error);
    });
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Pick image" onPress={pickImage} />
       <Button title="test" color="red" onPress={handleClick} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
    </View>
  );
}
