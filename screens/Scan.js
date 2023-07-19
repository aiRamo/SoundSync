import { View, Text, Button } from 'react-native'
import React from 'react'
import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { firebaseConfig } from '../firebaseConfig'

const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);

const Scan = () => {
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
    <View>
      <Text>Scan</Text>
      <Button 
      title="test" 
      color="red" 
      onPress={handleClick}
      />
    </View>
  )
}

export default Scan;