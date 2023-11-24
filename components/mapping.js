export default function mapping(allCoord, index) {
  if (allCoord) {
    const jsonData = JSON.parse(allCoord[index]);

    // Extract left positions
    const leftPositions = Object.values(jsonData).map(
      (note) => note.leftPosition
    );

    // Extract top positions
    const topPositions = Object.values(jsonData).map(
      (note) => note.topPosition
    );

    const map = new Map();

    for (let i = 0; i < leftPositions.length; i++) {
      const posValue = leftPositions[i];

      // Check if the value is already in the map
      if (map.has(posValue)) {
        const y1 = topPositions[map.get(posValue)];
        const y2 = topPositions[i];

        if (y2 - y1 < 50) {
          map.get(posValue).push(i);
        }

        // If it is, push the current index to the existing array of indexes
      } else {
        // If it's not, create a new array with the current index
        map.set(posValue, [i]);
      }
    }

    return { map, leftPositions, topPositions };
  }
}
