export const compileNoteData = (notesJson) => {
    const tableData = [
      ["Note Number", "Pitch", "Type", "Staff Number", "Chord", "Dot", "Measure Number"],
    ];
    let count = 0;
    notesJson.notes.forEach((measure) => {
      measure.notes.forEach((note) => {
        const pitch = note.pitch ? note.pitch[0] : "";
        const type = note.rest ? "rest" : note.type ? note.type[0] : "";
        const staffNumber = note.staff ? note.staff[0] : "";
        const hasChord = note.chord ? "chord" : "";
        const hasDot = note.dot ? "dot" : "";
        const measureNumber = measure.number;
        if (note.pitch) {
          tableData.push([
            ++count,
            `${pitch.step[0]}${pitch.octave[0]}`,
            type,
            staffNumber,
            hasChord,
            hasDot,
            measureNumber,
          ]);
        } else {
          tableData.push([
            ++count,
            "",
            type,
            staffNumber,
            hasChord,
            hasDot,
            measureNumber,
          ]);
        }
      });
    });
    return tableData;
  };