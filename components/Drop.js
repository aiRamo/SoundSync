// Dropdown.js

import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";

export default function Drop({ isVisible, options, onSelect, onClose }) {
  const handleOptionSelect = (option) => {
    onSelect(option);
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.dropdown}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleOptionSelect(option)}
          >
            <Text style={styles.dropdownOption}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    position: "absolute",
    right: 10,
    top: StatusBar.currentHeight,
    backgroundColor: "white",
    borderRadius: 5,
    elevation: 3,
    zIndex: 1,
  },
  dropdownOption: {
    padding: 10,
  },
});
