import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";

const { width, height } = Dimensions.get("window");

const EndingModal = ({ handlePress3 }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial fade value

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity: fadeAnim }, // Bind opacity to animated value
      ]}
    >
      <View style={styles.messageBox}>
        <Text style={styles.text}>You made it to the end!</Text>
      </View>

      <TouchableOpacity onPress={handlePress3} style={styles.buttonBox}>
        <Text style={styles.buttonText}>Go back</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    height: height,
    width: width,
    top: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    alignItems: "center",
    zIndex: 50,
  },
  messageBox: {
    top: "12%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
  },
  buttonBox: {
    top: "65%",
    backgroundColor: "#1B154C",
    borderRadius: 20,
    padding: 20,
  },
  text: {
    fontSize: 35,
    fontWeight: "600",
    color: "#1B154C",
    textAlign: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    textAlign: "center",
  },
});

export default EndingModal;
