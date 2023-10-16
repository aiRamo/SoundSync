import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import WebSocket from 'react-native-websocket';

export default function AudioRecorder() {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const scrollViewRef = useRef();

  const handleData = (data) => {
    // Handle incoming WebSocket data here
    setMessages((prevMessages) => [...prevMessages, data]);
    console.log('Received: ', data);
  };

  const handleOpen = () => {
    setIsConnected(true);
    console.log('WebSocket connected successfully.');
  };

  useEffect(() => {
    // Whenever messages change, scroll to the bottom of the ScrollView
    scrollViewRef.current.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>WebSocket Terminal:</Text>
      <Text>{isConnected ? 'Connected' : 'Connecting...'}</Text>
      <ScrollView
        ref={scrollViewRef}
        style={{ flex: 1, borderColor: 'gray', borderWidth: 1, marginBottom: 20 }}
      >
        {messages.map((message, index) => (
          <Text key={index}>{message}</Text>
        ))}
      </ScrollView>
      <WebSocket
        url="ws://192.168.15.111:7681" // Replace with your RPI's IP address and port
        onMessage={(message) => handleData(message)}
        onOpen={handleOpen} // Handle the WebSocket connection success
        onError={(error) => console.log('Error:', error)}
        onClose={(event) => console.log('Closed:', event)}
        reconnect // Enable auto-reconnect
      />
    </View>
  );
}
