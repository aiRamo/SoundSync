import React from "react";
import { View, Text } from "react-native";

const NoteHighlighter = ({ notePositions, currIndex }) => {
  return (
    <React.Fragment>
      {Object.keys(notePositions).map((key, index) => {
        const { leftPosition, topPosition } = notePositions[key];

        const isHighlighted = index === currIndex; // Check if this is the currently highlighted box
        return (
          <>
            <View
              key={`view_${index}`}
              style={{
                position: "absolute",
                width: 8,
                height: "5.5%",
                borderColor: isHighlighted ? "red" : "transparent", // Highlighted box has red border, others are transparent
                borderWidth: 1,
                top: topPosition,
                left: leftPosition + 37.5,
              }}
            />
            <Text
              key={`text_${index}`}
              style={{
                position: "absolute",
                height: "5.5%",
                top: topPosition,
                left: leftPosition + 12,
                fontSize: 12,
                alignSelf: "center",
                opacity: isHighlighted ? 1 : 0, // Highlighted box has opacity 1, others are hidden
              }}
            >
              {index + 1}
            </Text>
          </>
        );
      })}
    </React.Fragment>
  );
};

export default NoteHighlighter;
