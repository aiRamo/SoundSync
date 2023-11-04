import React, { useState } from "react";
import { Image, View, TouchableOpacity, Text } from "react-native";
import CaretLeft from "../../assets/caret-left.png";
import CaretRight from "../../assets/caret-right.png";
import styles from "../styleSheetScan";

const SheetScanPromptContent = ({
  pickImage,
  imageList,
  setScannerPhase,
  callAPIandWaitForResponse,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const scrollLeft = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const scrollRight = () => {
    if (currentImageIndex < imageList.length) {
      setCurrentImageIndex(currentImageIndex + 1);
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
        style={[
          styles.pickImageButtonContainer,
          isHovered && { opacity: 0.75 },
        ]}
        disabled={
          currentImageIndex < imageList.length && imageList.length !== 0
        }
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Image
          source={
            imageList.length === 0 || currentImageIndex >= imageList.length
              ? require("../../assets/addScan.png")
              : { uri: imageList[currentImageIndex] }
          }
          style={styles.imagePreview}
        />
      </TouchableOpacity>

      {imageList.length > 0 && (
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
