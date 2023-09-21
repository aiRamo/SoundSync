import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Animated,
  Easing,
  TouchableOpacity,
  Text,
  TextInput,
  StatusBar,
} from "react-native";
import SheetScanPrompt from "../components/UI/sheetScanPrompter";
import styles from "../components/styleSheetScan";
import Drop from "../components/Drop";
import { AUTH } from "../firebaseConfig";
import { Entypo } from "@expo/vector-icons";

export default function Scan({ navigation }) {
  const [scannerPhase, setScannerPhase] = useState(0);
  const [collectionName, onChangeCollectionName] = useState("");
  const [confirmNameButton, setConfirmNameButton] = useState(false);
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  // Initialize animated values
  const fadeAnim1 = useRef(new Animated.Value(0)).current;
  const translateYAnim1 = useRef(new Animated.Value(-50)).current;

  const fadeAnim2 = useRef(new Animated.Value(0)).current;
  const translateYAnim2 = useRef(new Animated.Value(-50)).current;

  const startAnimation = (fadeAnim, translateYAnim) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 2000,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    if (scannerPhase === 0) {
      fadeAnim1.setValue(0);
      translateYAnim1.setValue(-50);
      startAnimation(fadeAnim1, translateYAnim1);
    } else if (scannerPhase === 1) {
      fadeAnim2.setValue(0);
      translateYAnim2.setValue(-50);
      startAnimation(fadeAnim2, translateYAnim2);
    }
  }, [scannerPhase]);

  useEffect(() => {
    if (collectionName == "") {
      setConfirmNameButton(false);
    } else {
      setConfirmNameButton(true);
    }
  }, [collectionName]);

  const handleSignOut = async () => {
    try {
      await AUTH.signOut();
      navigation.navigate("Login", {});
      // Redirect or perform any other action after signing out.
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const handleDropdownSelect = (option) => {
    // Handle the selected option here
    if (option === "Settings") {
      navigation.navigate("Profile", {});
      // Handle the "Settings" action here
    } else if (option === "Sign Out") {
      handleSignOut();
      // Handle the "Sign Out" action here
    }

    // Close the dropdown
    setDropdownVisible(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          backgroundColor: "darkslateblue",
        }}
      >
        <View
          style={{
            marginTop: StatusBar.currentHeight,
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <TouchableOpacity
            style={{ marginBottom: 10 }}
            onPress={toggleDropdown}
          >
            <Entypo name="dots-three-vertical" size={24} color="white" />
          </TouchableOpacity>
          <Drop
            isVisible={isDropdownVisible}
            options={["Settings", "Sign Out", "Close"]}
            onSelect={handleDropdownSelect}
            onClose={() => setDropdownVisible(false)}
          />
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.namePropmtContent}>
          {scannerPhase == 0 && (
            <Animated.View
              style={{
                opacity: fadeAnim1,
                transform: [{ translateY: translateYAnim1 }],
              }}
            >
              <Text style={styles.introTitle}> First, Lets Give It a Name</Text>
              <View style={styles.namePromptCard}>
                <TextInput
                  style={styles.nameInput}
                  placeholder="Collection Name"
                  onChangeText={onChangeCollectionName}
                />
              </View>
              {confirmNameButton && (
                <TouchableOpacity
                  onPress={() => {
                    setScannerPhase(scannerPhase + 1);
                  }}
                >
                  <View style={styles.confirmNameButton}>
                    <Text style={styles.openButtonText}>Confirm</Text>
                  </View>
                </TouchableOpacity>
              )}
            </Animated.View>
          )}
        </View>
        {scannerPhase == 1 && (
          <Animated.View
            style={{
              opacity: fadeAnim2,
              transform: [{ translateY: translateYAnim2 }],
            }}
          >
            <SheetScanPrompt collectionName={collectionName} />
          </Animated.View>
        )}
      </View>
    </View>
  );
}
