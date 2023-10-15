import React, { Component } from 'react';
import { View, Text } from 'react-native';
import WebSocket from 'react-native-websocket';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
    };
  }

  handleData(data) {
    // Handle incoming WebSocket data here

    this.setState({ message: data });
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Received Message: {this.state.message}</Text>
        <WebSocket
          url="ws://192.168.1.108:9999" // Replace with your RPI's IP address and port
          onMessage={this.handleData.bind(this)}
          onError={(error) => console.log('Error:', error)}
          onClose={(event) => console.log('Closed:', event)}
          reconnect // Enable auto-reconnect
        />
      </View>
    );
  }
}