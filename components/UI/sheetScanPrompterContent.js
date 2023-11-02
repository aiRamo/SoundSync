import React, { useState, useRef } from "react";
import {
  Image,
  View,
  ScrollView,
  Modal,
  TouchableOpacity,
  Text,
  Platform,
} from "react-native";
import CaretLeft from "../../assets/caret-left.png";
import CaretRight from "../../assets/caret-right.png";
import styles from "../styleSheetScan";
import { BlurView } from "expo-blur";

// scannerModalContent.js is responsible for displaying all data to the user.
// This includes noteCoordinateData (JSON) and pngURL (firebase address of output image).
// This is where all post-API functionality occurs, such as the creation and upload of the noteHighlighter data.
import ScannerModalContent from "./scannerModalContent";

const SheetScanPromptContent = ({
  image,
  pickImage,
  imageList,
  callAPIandWaitForResponse,
  previewVisible,
  loadingDataForScannerModal,
  doneLoadingDataForScannerModal,
  actionsForScannerModal,
}) => {
  const [contentHeight, setContentHeight] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Used for keeping track of '# of #' counter

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const screenWidth = event.nativeEvent.layoutMeasurement.width;

    // Calculate current index based on scroll position and screen width
    const currentIndex = Math.round(scrollPosition / screenWidth);

    setCurrentImageIndex(currentIndex);
  };

  return (
    <View style={styles.content}>
      <Text style={styles.introTitle}> Next, Choose Your Images</Text>
      <View style={styles.imageCounterBar}>
        {currentImageIndex != imageList.length && (
          <>
            {currentImageIndex > 0 && (
              <Image source={CaretLeft} style={styles.caretIconLeft} />
            )}
            <Text style={styles.imageCounterText}>
              {currentImageIndex + 1} of {imageList.length}
            </Text>
            {currentImageIndex < imageList.length && (
              <Image source={CaretRight} style={styles.caretIconRight} />
            )}
          </>
        )}

        {currentImageIndex == imageList.length && (
          <Text style={styles.imageCounterText}>Select New Image</Text>
        )}
      </View>
      <ScrollView
        style={[styles.imageList, { height: contentHeight }]}
        contentContainerStyle={{ alignItems: "center" }}
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View
          onLayout={(event) => {
            const { height } = event.nativeEvent.layout;
            setContentHeight(height);
          }}
          style={{ flexDirection: "row" }}
        >
          {imageList.map((url, index) => (
            <View key={index} style={styles.pickImageButtonContainer}>
              <Image source={{ uri: url }} style={styles.imagePreview} />
            </View>
          ))}
          <TouchableOpacity
            onPress={pickImage}
            style={styles.pickImageButtonContainer}
          >
            <Image
              source={require("../../assets/addScan.png")}
              style={styles.imagePreview}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {image != require("../../assets/addScan.png") && (
        <>
          <TouchableOpacity
            onPress={callAPIandWaitForResponse}
            style={styles.testButtonContainer}
          >
            <Text style={styles.openButtonText}>Confirm</Text>
          </TouchableOpacity>
        </>
      )}

      {previewVisible && <Text>Working...</Text>}
    </View>
  );
};

export default SheetScanPromptContent;
