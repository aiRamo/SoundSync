import React, { useState } from "react";
import { Image, View, TouchableOpacity, Text } from "react-native";
import CaretLeft from "../../assets/caret-left.png";
import CaretRight from "../../assets/caret-right.png";
import styles from "../styleSheetScan";

const SheetScanPromptContent = ({
  image,
  setImage,
  pickImage,
  imageList,
  setScannerPhase,
  callAPIandWaitForResponse,
}) => {
  let currentImageIndex = 0; // Updated to a regular variable

  const updateImage = (index) => {
    if (imageList[index] != null) {
      setImage(imageList[index]);
    } else {
      setImage(require("../../assets/addScan.png"));
    }
  };

  const scrollLeft = () => {
    if (currentImageIndex > 0) {
      currentImageIndex -= 1; // Updated to decrement the index
      updateImage(currentImageIndex);
    }
  };

  const scrollRight = () => {
    console.log("BEFORE: " + imageList.length + "," + currentImageIndex);
    if (currentImageIndex < imageList.length) {
      currentImageIndex += 1; // Updated to increment the index
      updateImage(currentImageIndex);
    } else if (currentImageIndex >= imageList.length) {
      currentImageIndex += 1; // Increment to match the length for the condition below
      setImage(require("../../assets/addScan.png")); // Set the addScan image
    }
  };

  return (
    <View style={styles.content}>
      <Text style={styles.introTitle}> Next, Choose Your Images</Text>
      <View style={styles.imageCounterBar}>
        {currentImageIndex > 0 && (
          <TouchableOpacity
            style={[styles.caretTouchable, { left: "30vw" }]}
            onPress={scrollLeft}
          >
            <Image source={CaretLeft} style={styles.caretIconLeft} />
          </TouchableOpacity>
        )}
        {currentImageIndex != imageList.length && (
          <>
            <Text style={styles.imageCounterText}>
              {currentImageIndex + 1} of {imageList.length}
            </Text>
            {currentImageIndex < imageList.length && (
              <TouchableOpacity
                style={[styles.caretTouchable, { right: "30vw" }]}
                onPress={scrollRight}
              >
                <Image source={CaretRight} style={styles.caretIconRight} />
              </TouchableOpacity>
            )}
          </>
        )}

        {currentImageIndex == imageList.length && (
          <Text style={styles.imageCounterText}>Select New Image</Text>
        )}
      </View>
      <TouchableOpacity
        onPress={pickImage}
        style={styles.pickImageButtonContainer}
      >
        <Image source={image} style={styles.imagePreview} />
      </TouchableOpacity>

      {true && (
        <>
          <TouchableOpacity
            onPress={() => {
              setScannerPhase(3);

              callAPIandWaitForResponse();
              console.log("Boop");
            }}
            style={styles.testButtonContainer}
          >
            <Text style={styles.openButtonText}>Confirm</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default SheetScanPromptContent;
