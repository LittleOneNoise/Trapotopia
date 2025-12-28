import { getMaps } from './map.repository';
import { decodePuzzle } from '../utils/puzzle-encoder.utils';
import encodedPuzzles from '../data/puzzles.json';


export function getPuzzles() {
  const maps = getMaps();
  const puzzles = [];
  for (let id = 0; id < encodedPuzzles.length; id += 1) {
    // The line number is used as id. To avoid breaking the sequence
    // when removing a puzzle, it is instead set to empty.
    const encodedPuzzle = encodedPuzzles[id]!;
    if (encodedPuzzle === '') {
      continue;
    }

    puzzles.push(decodePuzzle(encodedPuzzle, id, maps));
  }

  return puzzles;
}
