import NoteHighlighter from "./UI/noteHighligher";

// Function to render note boxes and calculate their positions
const calculateNoteCoordinates = (noteCoordinates, ViewWidth, ViewHeight) => {
  const notePositions = {};

  // Parse layout margins and dimensions
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

  let boxCounter = 0; // Counter for debugging
  let systemYOffset = 0; // Vertical offset for new systems

  // Iterate through each part to calculate note positions
  noteCoordinates.parts.forEach((part, partIndex) => {
    let cumulativeMeasureWidth = 0;
    let measureLeftMargin = 0;
    let staffDistance = 0;
    let topSysDist = 0;

    const partAdjustment = -5 * partIndex;
    systemYOffset = 0; // Reset for each new part

    part.measures.forEach((measure, measureIndex) => {
      measureLeftMargin = measure.leftMargin
        ? parseInt(measure.leftMargin, 10)
        : measureLeftMargin;
      staffDistance = measure.staffDistance
        ? parseInt(measure.staffDistance, 10) + 60
        : staffDistance;
      topSysDist =
        measure.topSystemDistance !== null
          ? parseInt(measure.topSystemDistance)
          : 0;

      if (measure.systemDistance !== null) {
        cumulativeMeasureWidth = 0;
        systemYOffset +=
          parseInt(measure.systemDistance, 10) + 140 + topSysDist;
      }

      measure.notes.forEach((note, noteIndex) => {
        boxCounter++;
        const noteDefaultX = parseInt(note.defaultX, 10);

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

        notePositions[`note_${boxCounter}`] = { leftPosition, topPosition };
      });

      cumulativeMeasureWidth += parseInt(measure.width, 10);
    });
  });

  return <NoteHighlighter notePositions={notePositions} />;
};

export default calculateNoteCoordinates;
