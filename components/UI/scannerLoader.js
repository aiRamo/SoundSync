import React from "react";
import { Platform, View, Text, StyleSheet } from "react-native";

import LoadingLogo from "../../assets/LoadingLogo.svg";

const SvgWithScript = () => {
  if (Platform.OS === "web") {
    return (
      <View style={styles.container}>
        <View style={styles.svgContainer}>
          <object
            data={LoadingLogo}
            type="image/svg+xml"
            style={styles.responsiveSvg}
          >
            <p>Your browser does not support embedded SVG files.</p>
          </object>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Animated SVGs are not supported on this platform.</Text>
    </View>
  );
};

// You can define your styles here
const styles = StyleSheet.create({
  container: {
    flex: 1,  // This will make sure the container takes all available space
    justifyContent: "center", // Centers children vertically in container
    alignItems: "center", // Centers children horizontally in container
  },
  svgContainer: {
    alignSelf: "center",
    maxHeight: "50%",
    width: "100%", // Makes sure the container takes all available width
  },
  responsiveSvg: {
    alignSelf: "center",
    width: "100%", // Makes the SVG take all available width of its parent
    height: "100%", // Makes the SVG take all available height of its parent
  },
});

export default SvgWithScript;
