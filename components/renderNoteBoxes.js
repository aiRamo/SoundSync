import { View } from "react-native";

const renderNoteBoxes = (noteCoordinates, ViewWidth, ViewHeight) => {
    const pageLayoutLeftMargin = parseInt(noteCoordinates.pageLayout.leftMargin, 10);
    const pageLayoutTopMargin = parseInt(noteCoordinates.pageLayout.topMargin, 10);
    const pageWidth = parseInt(noteCoordinates.pageLayout.pageWidth, 10);
    const pageHeight = parseInt(noteCoordinates.pageLayout.pageHeight, 10);

    return noteCoordinates.parts.map((part, partIndex) => {
        let cumulativeMeasureWidth = 0;
        let measureLeftMargin = 0; // Initialize measureLeftMargin
        let yOffset = 0;
        let staffDistance = 0;

        return part.measures.map((measure, measureIndex) => {
        measureLeftMargin = measure.leftMargin ? parseInt(measure.leftMargin, 10) : measureLeftMargin;
        staffDistance = measure.staffDistance ? parseInt(measure.staffDistance, 10) : staffDistance;

        const noteViews = measure.notes.map((note, noteIndex) => {
            const noteDefaultX = parseInt(note.defaultX, 10);
            const noteDefaultY = Math.abs(parseInt(note.defaultY, 10));

            if (parseInt(note.defaultY, 10) < 0) {
            yOffset = ViewHeight * 0.04;
            } else {
            yOffset = ViewHeight * 0.028;
            }

            // Calculate the left and top positions
            const leftPosition = (((pageLayoutLeftMargin + measureLeftMargin + cumulativeMeasureWidth + noteDefaultX) / pageWidth) * ViewWidth) - 3;
            const topPosition = (((pageLayoutTopMargin + noteDefaultY + staffDistance) / pageHeight) * ViewHeight) - yOffset;

            //console.log(`Part ${partIndex} | Measure ${measureIndex} | Note ${noteIndex} -> Left: ${leftPosition}, Top: ${topPosition}`);

            return (
            <View
                key={`${partIndex}-${measureIndex}-${noteIndex}`}
                style={{
                position: "absolute",
                width: 8,
                height: "3.5%",
                borderColor: "red",
                borderWidth: 1,
                top: topPosition,
                left: leftPosition,
                }}
            />
            );
        });

        cumulativeMeasureWidth += parseInt(measure.width, 10);  // Update cumulativeMeasureWidth for each measure.

        return noteViews;
        });
    });
};

export default renderNoteBoxes;