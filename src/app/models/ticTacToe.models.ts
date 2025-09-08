export interface TicTacToe {
  board: ('X' | 'O' | null)[][];
  currentPlayer: 'X' | 'O';
  winner: 'X' | 'O' | 'draw' | null;
}
