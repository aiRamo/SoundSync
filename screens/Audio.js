import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { WebView } from 'react-native-webview';

export default function AudioRecorder(){
  const [lastMessage, setLastMessage] = useState('No messages yet');

  useEffect(() => {
    // Set up a WebSocket connection to your server
    const ws = new WebSocket('ws://192.168.1.108:9000');

    // Handle received messages
    ws.onmessage = (event) => {
      setLastMessage(event.data);
    };

    return () => {
      // Close the WebSocket connection when unmounting the component
      ws.close();
    };
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{lastMessage}</Text>
    </View>
  );
};
