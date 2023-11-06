import React, { useState, useEffect, useRef } from "react";
import { ScrollView, View, Dimensions, Text } from "react-native";
import styles from "../components/styleSheetScan";
import RadialGradient from "../components/UI/RadialGradient";
import API_URL from "../API_URL.json";

const { width, height } = Dimensions.get("window");

export default function Test({ route }) {
  const [data, setData] = useState({
    frequency: "",
    noteString: "",
  });

  useEffect(() => {
    // Connect to WebSocket server
    console.log("attempting to connect...");
    const webSocket = new WebSocket(API_URL.API_URL_WS_AUDIO);

    webSocket.onopen = () => {
      // Connection established
      console.log("WebSocket connection established");
    };

    webSocket.onmessage = (e) => {
      // A message was received, parse frequency and noteString
      const message = e.data; // Assuming message is in "frequency,noteString" format
      const delimiterIndex = message.indexOf(","); // Find the comma delimiter index
      if (delimiterIndex !== -1) {
        // Make sure the comma exists
        const frequency = message.substring(0, delimiterIndex).trim(); // Extract frequency
        const noteString = message.substring(delimiterIndex + 1).trim(); // Extract noteString
        setData({ frequency, noteString }); // Update state with new data
      }
    };

    webSocket.onerror = (e) => {
      // An error occurred
      console.log(e.message);
    };

    webSocket.onclose = (e) => {
      // Connection closed
      console.log("WebSocket connection closed");
    };

    // Cleanup on unmount
    return () => {
      webSocket.close();
    };
  }, []);

  return (
    <View style={{ flex: 1, zIndex: 0 }}>
      <View style={[styles.gradientContainerScanner, { zIndex: 1 }]}>
        <RadialGradient style={{ ...styles.gradient, zIndex: 2 }} />
      </View>
      <View
        style={{
          position: "absolute",
          top: 0,
          height: height,
          width: width,
          zIndex: 3,
        }}
      >
        <Text
          style={{
            position: "relative",
            top: "13%",
            fontSize: 35,
            fontWeight: "600",
            color: "rgba(255,255,255,1)",
            textAlign: "center",
          }}
        >
          Detected Audio
        </Text>
        <View
          style={{
            top: height * 0.33,
            left: width * 0.38,
            width: width * 0.1,
            height: height * 0.1,
            justifyContent: "center",
            alignItems: "flex-end",
          }}
        >
          <Text
            style={{
              fontSize: 35,
              fontWeight: "600",
              color: "rgba(255,255,255,1)",
              textAlign: "right",
            }}
          >
            {data.frequency}
          </Text>
        </View>

        <Text
          style={{
            position: "absolute",
            top: height * 0.4,
            left: width * 0.5,
            fontSize: 35,
            fontWeight: "600",
            color: "rgba(255,255,255,1)",
            textAlign: "center",
          }}
        >
          |
        </Text>
        <View
          style={{
            top: height * 0.23,
            left: width * 0.53,
            width: width * 0.1,
            height: height * 0.1,
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <Text
            style={{
              fontSize: 35,
              fontWeight: "600",
              color: "rgba(255,255,255,1)",
              textAlign: "left",
            }}
          >
            {data.noteString}
          </Text>
        </View>
      </View>
    </View>
  );
}
