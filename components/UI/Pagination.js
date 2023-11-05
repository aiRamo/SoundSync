import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";

import CaretLeft from "../../assets/caret-left.png";
import CaretRight from "../../assets/caret-right.png";

const Pagination = ({ count, setImageIndex, showLastSpecial }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSetImageIndex = (index) => {
    setActiveIndex(index);
    setImageIndex(index); // Call the setter function passed as a prop
  };

  const handlePrevious = () => {
    if (activeIndex > 0) {
      handleSetImageIndex(activeIndex - 1);
    }
  };

  const handleNext = () => {
    if (activeIndex < count - 1) {
      handleSetImageIndex(activeIndex + 1);
    }
  };

  const renderPaginationNumbers = () => {
    return Array.from({ length: count }, (_, index) => (
      <TouchableOpacity
        key={index}
        style={[
          styles.paginationNumber,
          activeIndex === index && styles.activePaginationNumber,
          showLastSpecial &&
            index === count - 1 &&
            activeIndex === index &&
            styles.lastPaginationNumber,
        ]}
        onPress={() => handleSetImageIndex(index)}
      >
        <Text
          style={[
            activeIndex === index ? styles.activeText : styles.text,
            showLastSpecial && index === count - 1 && styles.plusText,
          ]}
        >
          {showLastSpecial && index === count - 1 ? "+" : index + 1}
        </Text>
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.paginationContainer}>
      <TouchableOpacity onPress={handlePrevious} disabled={activeIndex === 0}>
        <Image source={CaretLeft} style={styles.arrow} />
      </TouchableOpacity>
      {renderPaginationNumbers()}
      <TouchableOpacity
        onPress={handleNext}
        disabled={activeIndex === count - 1}
      >
        <Image source={CaretRight} style={styles.arrow} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "2vh",
  },
  paginationNumber: {
    marginHorizontal: 5,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  activePaginationNumber: {
    backgroundColor: "white",
    borderRadius: 4,
  },
  lastPaginationNumber: {
    backgroundColor: "#46B1C9",
    borderRadius: 4,
  },
  text: {
    fontWeight: 500,
    color: "white",
  },
  plusText: {
    fontWeight: 500,
    fontSize: 22,
    marginBottom: 5,
    color: "white",
  },
  activeText: {
    fontWeight: 500,
    color: "black",
  },
  arrow: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
});

export default Pagination;
