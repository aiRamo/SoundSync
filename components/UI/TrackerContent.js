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
import styles from "../styleSheetScan";

const { width, height } = Dimensions.get("window");
const A4_RATIO = 1.4;
const ViewWidth = width * 0.26; // 90% of device width
const ViewHeight = ViewWidth * A4_RATIO;

const TrackerContent = ({
  imageUrls,
  allCoord,
  count3,
  highlightNotes,
  scrollViewRef,
  inputText,
  setInputText,
  handleConfirm,
  handlePress2,
  isToggled,
}) => {
  return (
    <View style={{ flex: 1, backgroundColor: "#483d8b" }}>
      <View
        style={[
          styles.gradientContainerScanner,
          { zIndex: 0, height: height, width: width, bottom: 0 },
        ]}
      >
        <RadialGradient style={{ ...styles.gradient, zIndex: 0 }} />
      </View>

      <View style={{ marginTop: 50 }}>
        <TouchableOpacity
          style={[styles2.button, isToggled && styles2.toggledButton]}
          onPress={handlePress2}
        >
          <Text style={styles2.buttonText}>Play Mode</Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginLeft: 400, marginRight: 400, marginTop: 10 }}>
        <TextInput
          style={{ backgroundColor: "white" }}
          placeholder="Type here..."
          onChangeText={(text) => setInputText(text)}
          value={inputText}
        />
        <Button title="Confirm" onPress={handleConfirm} />
      </View>

      <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
        <View
          style={{
            alignItems: "center",
            backgroundColor: "white",
            alignSelf: "center",
            marginTop: 25,
            borderRadius: 0,
            height: ViewHeight,
            width: ViewWidth,
            zIndex: 8,
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
                  zIndex: 8,
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
