import React, { useState, useCallback, useRef } from "react";
import { ScrollView, View, Dimensions, Text } from "react-native";
import styles from "../components/styleSheetScan";
import RadialGradient from "../components/UI/RadialGradient";
import useAudioWebSocket from "../components/AudioWebSocket";

const { width, height } = Dimensions.get("window");

export default function Test({ route }) {
  const [data, setData] = useState({
    frequency: "",
    noteString: "",
  });

  // Custom callback similar to useEffect that is only triggered when the websocket sends data.
  const getAudioModuleData = useCallback(
    (newData) => {
      setData((prevData) => {
        if (
          newData.frequency !== prevData.frequency ||
          newData.noteString !== prevData.noteString
        ) {
          return newData;
        }
        return prevData;
      });
    },
    [] // No dependencies needed, just need pass this into useAudioWebSocket
  );

  useAudioWebSocket(getAudioModuleData); // Main method to toggle the Audio module's websocket. Pass the custom callback to set data in a live stream.

  return (
    <View style={{ flex: 1, zIndex: 0, width: width, color: "#483d8b" }}>
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
