import React from "react";
import { Platform, View } from "react-native";

const RadialGradient = ({ style, children }) => {
  // Style for your radial gradient
  const webStyle = {
    ...style,
    // Define your radial gradient using standard CSS here
    backgroundImage:
      "radial-gradient(circle, rgba(190, 186, 226, 1) 0%, rgba(137, 144, 160, 0) 75%)",
  };

  if (Platform.OS === "web") {
    // Use 'div' for web with specific gradient style
    return <div style={webStyle}>{children}</div>;
  } else {
    // Return plain view for native, or implement native gradient if available
    return <View style={style}>{children}</View>;
  }
};

export default RadialGradient;
