// Sends the rebuilt notePositionsJSON to the firebase storage location by the relevant collectionName
import { sendJSONToSheetCollection } from "./firebaseUtils";

// Calculates each note's position on the page using a percentage-based approach (EX. 40% from the left of the page, 20% from the top.)
const calculateNoteCoordinates = async (
  noteCoordinates,
  collectionName,
  imageNumber,
  ViewWidth,
  ViewHeight
) => {
  const notePositions = {};
  // Check entire JSON object for any 'staffDistance'
  let hasStaffDistance = false;
  noteCoordinates.parts.forEach((part) => {
    part.measures.forEach((measure) => {
      if (measure.staffDistance) {
        hasStaffDistance = true;
      }
    });
  });

  // Set global additionalOffset based on presence of staffDistance
  const globalAdditionalOffset = hasStaffDistance
    ? ViewHeight * 0.17
    : ViewHeight * 0.053;

  const headerOffset = ViewHeight * 0.055;

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
        ? parseInt(measure.staffDistance, 10) + ViewHeight * 0.05
        : staffDistance;
      topSysDist =
        measure.topSystemDistance !== null
          ? parseInt(measure.topSystemDistance)
          : 0;

      if (measure.systemDistance !== null) {
        cumulativeMeasureWidth = 0;

        systemYOffset +=
          parseInt(measure.systemDistance, 10) +
          globalAdditionalOffset +
          topSysDist;
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
          ViewHeight * 0.038;
        topPosition += partAdjustment;
        topPosition += headerOffset;

        notePositions[`note_${boxCounter}`] = { leftPosition, topPosition };
      });

      cumulativeMeasureWidth += parseInt(measure.width, 10);
    });
  });

  const notePositionsJSON = JSON.stringify(notePositions);

  sendJSONToSheetCollection(
    notePositionsJSON,
    collectionName,
    `sheetCoordinateData/${imageNumber}coordinateData.json`
  );

  //setParsedNotePositions(JSON.parse(notePositionsJSON));

  //return <NoteHighlighter notePositions={parsedNotePositions} currIndex={6} />;
};

export default calculateNoteCoordinates;
