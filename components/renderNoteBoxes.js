import { View, Text } from "react-native";

const renderNoteBoxes = (noteCoordinates, ViewWidth, ViewHeight) => {
  const pageLayoutLeftMargin = parseInt(
    noteCoordinates.pageLayout.leftMargin,
    10
  );
  const pageLayoutTopMargin = parseInt(
    noteCoordinates.pageLayout.topMargin,
    10
  );
  const pageWidth = parseInt(noteCoordinates.pageLayout.pageWidth, 10);
  const pageHeight = parseInt(noteCoordinates.pageLayout.pageHeight, 10);

  let boxCounter = 0; // Incrementing counter for location debugging
  let systemYOffset = 0; // Initialize systemYOffset to keep track of the vertical offset for new systems

  return noteCoordinates.parts.map((part, partIndex) => {
    let cumulativeMeasureWidth = 0;
    let measureLeftMargin = 0;
    let yOffset = 0;
    let staffDistance = 0;
    let topSysDist = 0;

    let partAdjustment = 0;
    partAdjustment = -5 * partIndex;

    console.log(`Part adjustment for index ${partIndex} is ${partAdjustment}`);

    systemYOffset = 0; // Reset systemYOffset for each new part

    return part.measures.map((measure, measureIndex) => {
      measureLeftMargin = measure.leftMargin
        ? parseInt(measure.leftMargin, 10)
        : measureLeftMargin;
      staffDistance = measure.staffDistance
        ? parseInt(measure.staffDistance, 10) + 60
        : staffDistance;

      if (measure.topSystemDistance !== null) {
        topSysDist = parseInt(measure.topSystemDistance);
      } else {
        topSysDist = 0;
      }

      if (measure.systemDistance !== null) {
        cumulativeMeasureWidth = 0;
        systemYOffset +=
          parseInt(measure.systemDistance, 10) + 140 + topSysDist;
      }

      const noteViews = measure.notes.map((note, noteIndex) => {
        boxCounter++;
        const noteDefaultX = parseInt(note.defaultX, 10);

        yOffset =
          parseInt(note.defaultY, 10) < 0
            ? ViewHeight * 0.04
            : ViewHeight * 0.028;

        const leftPosition =
          ((pageLayoutLeftMargin +
            measureLeftMargin +
            cumulativeMeasureWidth +
            noteDefaultX) /
            pageWidth) *
            ViewWidth -
          3;

        let topPosition =
          ((systemYOffset + pageLayoutTopMargin + staffDistance) / pageHeight) *
            ViewHeight -
          ViewHeight * 0.035;

        topPosition += partAdjustment;

        return (
          <>
            <View
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
              {boxCounter}
            </Text>
          </>
        );
      });

      cumulativeMeasureWidth += parseInt(measure.width, 10);
      return noteViews;
    });
  });
};

export default renderNoteBoxes;
