import React from "react";
import { View, Text } from "react-native";

const NoteHighlighter = ({ notePositions, currIndex }) => {
  const isHighlightAll = currIndex === -1;

  return (
    <>
      {Object.keys(notePositions).map((key, index) => {
        const { leftPosition, topPosition } = notePositions[key];

        //const isHighlighted = isHighlightAll || index <= currIndex; // Check if this is the currently highlighted box
        const isHighlighted = isHighlightAll || currIndex.includes(index); // Check if this is the currently highlighted box
        return (
          <React.Fragment key={`note_${index}`}>
            <View
              key={`view_${index}`}
              style={{
                position: "absolute",
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: isHighlighted ? "#5b5591" : "transparent", // Highlighted purple circle around current note and previous notes, others are trasparent
                opacity: 0.5,
                top: topPosition + 15,
                left: leftPosition - 3,
                zIndex: 10,
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
                zIndex: 10,
              }}
            >
              {index + 1}
            </Text>
          </React.Fragment>
        );
      })}
    </>
  );
};

export default NoteHighlighter;
