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
import EndingModal from "./EndingModal";

import FadeTransition from "./fadeTransition";

const { width, height } = Dimensions.get("window");
const A4_RATIO = 1.4;

const ViewHeight = height * 0.8; // Control Sizing Here

const ViewWidth = ViewHeight / A4_RATIO;

const TrackerContent = ({
  imageUrls,
  allCoord,
  highlightedIndexes,
  mainIndex,
  scrollViewRef,
  handlePress3,
  collectionName1,
  isListening,
  reachedEnd,
}) => {
  const [scannerPhase, setScannerPhase] = React.useState(0);
  const [loadedImages, setLoadedImages] = React.useState({});
  const [dataLoaded, setDataLoaded] = React.useState({});

  const handleImageLoaded = (index) => {
    setLoadedImages((prevLoadedImages) => ({
      ...prevLoadedImages,
      [index]: true,
    }));
    // Check if data for this index is loaded
    if (allCoord) {
      if (allCoord[index]) {
        setDataLoaded((prevDataLoaded) => ({
          ...prevDataLoaded,
          [index]: true,
        }));
      }
    }
  };

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
          {isListening && (
            <Text style={[styles.introTitle, { width: 300 }]}>
              Listening Now! Make Some Music.
            </Text>
          )}
        </View>

        <View
          style={{
            marginTop: 10,
            marginBottom: 10,
            flexDirection: "row",
            justifyContent: "center",
            alignContent: "center",
          }}
        ></View>

        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          style={{
            position: "absolute",
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
                  onLoad={() => handleImageLoaded(index)}
                  onError={(error) => {
                    console.log("Image failed to load:", error);
                  }}
                  style={{
                    width: ViewWidth,
                    height: ViewHeight,
                    resizeMode: "contain",
                  }}
                />
                {loadedImages[index] &&
                  dataLoaded[index] &&
                  mainIndex == index && (
                    <NoteHighlighter
                      key={`noteHighlighter_${index}`}
                      notePositions={JSON.parse(allCoord[index] || "[]")}
                      currIndex={highlightedIndexes}
                    />
                  )}
              </View>
            ))}
          </View>
        </ScrollView>
      </FadeTransition>
      {reachedEnd && <EndingModal handlePress3={handlePress3} />}
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
  button2: {
    padding: 10,
    backgroundColor: "orange",
    borderRadius: 5,
    marginLeft: 10,
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
