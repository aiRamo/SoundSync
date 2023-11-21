import React from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  Button,
  Dimensions,
} from "react-native";
import NoteHighlighter from "./noteHighligher";
import RadialGradient from "./RadialGradient";
import { AntDesign } from "@expo/vector-icons";
import styles from "../styleSheetScan";

import FadeTransition from "./fadeTransition";

const { width, height } = Dimensions.get("window");
const A4_RATIO = 1.4;
const ViewWidth = width * 0.28; // Control music sheet sizing here by changing ratio
const ViewHeight = ViewWidth * A4_RATIO;

const TrackerContent = ({
  imageUrls,
  allCoord,
  count3,
  highlightNotes,
  scrollViewRef,
  handlePress2,
  handlePress3,
  isToggled,
  collectionName1,
}) => {
  const [scannerPhase, setScannerPhase] = React.useState(0);
  return (
    <View style={{ flex: 1, backgroundColor: "#483d8b" }}>
      <View
        style={[
          styles.gradientContainerScanner,
          {
            zIndex: 0,
            height: height,
            width: width,
            bottom: 0,
            backgroundColor: "#e3e1f2",
          },
        ]}
      >
        <RadialGradient style={{ ...styles.gradient, zIndex: 0 }} />
      </View>
      <FadeTransition
        phase={scannerPhase}
        key={scannerPhase}
        setPhase={setScannerPhase}
      >
        <View style={{ left: 10, width: 50, top: 10 }}>
          <TouchableOpacity
            style={{
              borderWidth: 1, // Adjust the border width as needed
              borderColor: "black", // Adjust the border color as needed
              borderRadius: 8, // Adjust the border radius as needed
              padding: 10,
            }}
            onPress={handlePress3}
          >
            <AntDesign name="back" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <View
          style={{
            alignSelf: "center",
            width: 300,
            height: 50,
            top: 10,
          }}
        >
          <Text style={[styles.introTitle, { width: 300 }]}>
            {collectionName1}
          </Text>
        </View>

        <View style={{ marginTop: 10, marginBottom: 10 }}>
          <TouchableOpacity
            style={[styles2.button, isToggled && styles2.toggledButton]}
            onPress={handlePress2}
          >
            <Text style={styles2.buttonText}>Play Mode</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          style={{
            height: ViewHeight,
            width: ViewWidth,
            alignSelf: "center",
            bottom: 0,
          }}
        >
          <View
            style={{
              alignItems: "center",
              backgroundColor: "white",
              alignSelf: "center",
              height: 0,
              width: 0,
            }}
          >
            {imageUrls.map((url, index) => (
              <View key={index}>
                <Image
                  source={{ uri: url }}
                  onError={(error) => {
                    console.log("Image failed to load:", error);
                    // You can add an error message to the component state
                    // to display a message to the user.
                  }}
                  style={{
                    width: ViewWidth,
                    height: ViewHeight,
                    resizeMode: "contain",
                  }}
                />

                {highlightNotes && allCoord[index] && (
                  <NoteHighlighter
                    key={`noteHighlighter_${index}`}
                    notePositions={JSON.parse(allCoord[index])}
                    currIndex={count3}
                  />
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      </FadeTransition>
    </View>
  );
};

const styles2 = StyleSheet.create({
  button: {
    padding: 10,
    backgroundColor: "orange",
    borderRadius: 5,
    alignItems: "center",
    alignSelf: "center",
  },
  toggledButton: {
    backgroundColor: "#2c3e50", // Darkened color for toggled state
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default TrackerContent;
