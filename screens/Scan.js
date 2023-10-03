import React, { useState, useEffect } from "react";
import { View } from "react-native";
import styles from "../components/styleSheetScan";
import SheetScanPrompt from "../components/UI/sheetScanPrompter";
import CollectionNamePrompt from "../components/UI/collectionNamePrompter";
import Header from "../components/UI/header";
import FadeTransition from "../components/UI/fadeTransition";

export default function Scan({ navigation, route }) {
  /*
    scannerPhase is in groups of 2 for each UI element for Scan. 
    The first phase (even number) represents an entrance, and plays the fade in accordingly
    The second phase (odd number) represents an exit, and plays the fade out accordingly
  */
  const [scannerPhase, setScannerPhase] = useState(0);
  const [collectionName, onChangeCollectionName] = useState("");
  const [confirmNameButton, setConfirmNameButton] = useState(false);

  if (route.params != null) {
    const { imgeUrl } = route.params;
    console.log(imgeUrl);
  }

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
