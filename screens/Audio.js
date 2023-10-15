import React, { useState } from 'react';
import { View, Text } from 'react-native';
import WebSocket from 'react-native-websocket';

export default function AudioRecorder() {
  const [message, setMessage] = useState('');

  const handleData = (data) => {
    // Handle incoming WebSocket data here
    setMessage(data);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Received Message: {message}</Text>
      <WebSocket
        url="ws://192.168.1.108:7681" // Replace with your RPI's IP address and port
        onMessage={(message) => handleData(message)}
        onError={(error) => console.log('Error:', error)}
        onClose={(event) => console.log('Closed:', event)}
        reconnect // Enable auto-reconnect
      />
    </View>
  );
  }