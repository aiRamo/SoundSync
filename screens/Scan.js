import React, { useState, useEffect } from "react";
import { View } from "react-native";
import styles from "../components/styleSheetScan";

// collectionNamePrompter.js prompts the user to provide a collectionName via a modal.
// This collectionName is sent back to Scan.js to be used with sheetScanPrompter.
import CollectionNamePrompt from "../components/UI/collectionNamePrompter";

// sheetScanPrompter.js hosts functionality towards selecting a photo and communicating with the Audiveris API
// SheetScanPrompt is the modal component that appears after picking a collectionName
// this hosts all functionality for the scanner system besides the collectionName prompter.
import SheetScanPrompt from "../components/UI/sheetScanPrompter";

import Header from "../components/UI/header";
import FadeTransition from "../components/UI/fadeTransition";

export default function Scan({ navigation }) {
  /*
    scannerPhase is in groups of 2 for each UI element for Scan. 
    The first phase (even number) represents an entrance, and plays the fade in accordingly
    The second phase (odd number) represents an exit, and plays the fade out accordingly
  */
  const [scannerPhase, setScannerPhase] = useState(0);
  const [collectionName, onChangeCollectionName] = useState("");
  const [confirmNameButton, setConfirmNameButton] = useState(false);

  useEffect(() => {
    if (collectionName === "") {
      setConfirmNameButton(false);
    } else {
      setConfirmNameButton(true);
    }
  }, [collectionName]);

  return (
    <View style={{ flex: 1 }}>
      <Header navigation={navigation} />
      <View style={styles.container}>
        <FadeTransition
          phase={scannerPhase}
          key={scannerPhase}
          setPhase={setScannerPhase}
        >
          {(scannerPhase === 0 || scannerPhase === 1) && (
            <CollectionNamePrompt
              collectionName={collectionName}
              onChangeCollectionName={onChangeCollectionName}
              confirmNameButton={confirmNameButton}
              setScannerPhase={setScannerPhase}
              scannerPhase={scannerPhase}
            />
          )}
          {(scannerPhase === 2 || scannerPhase === 3) && (
            <SheetScanPrompt collectionName={collectionName} />
          )}
        </FadeTransition>
      </View>
    </View>
  );
}
