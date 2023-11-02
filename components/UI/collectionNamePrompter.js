import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import styles from "../styleSheetScan";

const CollectionNamePrompt = ({
  collectionName,
  onChangeCollectionName,
  confirmNameButton,
  setScannerPhase,
  scannerPhase,
}) => {
  const [placeholder, setPlaceholder] = useState(
    collectionName ? collectionName : "Collection Name"
  );

  return (
    <View style={styles.namePropmtContent}>
      <Text style={styles.introTitle}> First, Lets Give It a Name</Text>
      <View style={styles.namePromptCard}>
        <TextInput
          style={styles.nameInput}
          placeholder={placeholder}
          onChangeText={onChangeCollectionName}
        />
      </View>
      <TouchableOpacity
        onPress={() => {
          setPlaceholder(collectionName);
          setScannerPhase(scannerPhase + 1);
        }}
        disabled={collectionName == ""}
      >
        <View
          style={[styles.confirmNameButton, collectionName && { opacity: 1 }]}
        >
          <Text style={styles.openButtonText}>Confirm</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default CollectionNamePrompt;
