export async function retrieve(array) {
  let noteArray = [];
  for (const part of array) {
    for (const note of part.notes) {
      for (const pitch of note.pitch) {
        const step = pitch.step[0];
        const octave = pitch.octave[0];
        const temp = step + octave;
        noteArray.push(temp);
      }
    }
  }

  return noteArray; // Return the noteArray
}
