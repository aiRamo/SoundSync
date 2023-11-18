import React, { useState } from "react";
import { Image, View, TouchableOpacity, Text } from "react-native";
import Pagination from "./Pagination";
import styles from "../styleSheetScan";
import DownArrow from "../../assets/down-arrow.png";

const SheetScanPromptContent = ({
  pickImage,
  imageList,
  setScannerPhase,
  callAPIandWaitForResponse,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <View style={styles.content}>
      <Text style={styles.introTitle}> Next, Choose Your Images</Text>

      {imageList.length > 0 && (
        <Pagination
          count={imageList.length + 1}
          setImageIndex={setCurrentImageIndex}
          showLastSpecial={true}
        />
      )}

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
            <Text style={styles.scanButtonText}>Scan</Text>
            <Image source={DownArrow} style={styles.downArrowIcon} />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default SheetScanPromptContent;
