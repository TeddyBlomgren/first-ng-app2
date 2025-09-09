import { Injectable } from '@angular/core';
import { TicTacToe } from '../models/ticTacToe.models';

@Injectable({ providedIn: 'root' })
export class TicTacToeService {
  private game: TicTacToe = {
    board: [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ],
    currentPlayer: 'X',
    winner: null,
  };
  getGame(): TicTacToe {
    return this.game;
  }

  checkWinner(): void {
    const b = this.game.board;

    const lines = [
      [b[0][0], b[0][1], b[0][2]],
      [b[1][0], b[1][1], b[1][2]],
      [b[2][0], b[2][1], b[2][2]],

      [b[0][0], b[1][0], b[2][0]],
      [b[0][1], b[1][1], b[2][1]],
      [b[0][2], b[1][2], b[2][2]],

      [b[0][0], b[1][1], b[2][2]],
      [b[0][2], b[1][1], b[2][0]],
    ];

    // Kolla alla linjer
    for (let line of lines) {
      if (line[0] && line[0] === line[1] && line[1] === line[2]) {
        this.game.winner = line[0];
        return;
      }
    }

    // Kolla oavgjort
    if (b.flat().every((cell) => cell !== null)) {
      this.game.winner = 'draw';
    }
  }

  resetGame(): void {
    this.game = {
      board: [
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ],
      currentPlayer: 'X',
      winner: null,
    };
  }

  playMove(row: number, col: number): boolean {
    // Kolla om rutan är tom och spelet inte är slut
    if (this.game.board[row][col] === null && !this.game.winner) {
      this.game.board[row][col] = this.game.currentPlayer;

      this.checkWinner();
      if (!this.game.winner) {
        this.game.currentPlayer = this.game.currentPlayer === 'X' ? 'O' : 'X';
      }
      return true;
    }
    return false;
  }
}
