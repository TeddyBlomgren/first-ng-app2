export interface FourInARow {
  board: ('R' | 'Y' | null)[][];
  currentPlayer: 'R' | 'Y';
  winner: 'R' | 'Y' | null;
}
