import React from "react";
import { View, Text } from "react-native";

const NoteHighlighter = ({ notePositions }) => {
  return (
    <React.Fragment key={`fragment_${index}`}>
      {Object.keys(notePositions).map((key, index) => {
        const { leftPosition, topPosition } = notePositions[key];
        return (
          <>
            <View
              key={`view_${index}`}
              style={{
                position: "absolute",
                width: 8,
                height: "5.5%",
                borderColor: "red",
                borderWidth: 1,
                top: topPosition,
                left: leftPosition,
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
                opacity: 0,
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
