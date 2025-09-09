import { Injectable } from '@angular/core';
import { FourInARow as FourInARowModel } from '../models/four-in-a-row.models';

@Injectable({ providedIn: 'root' })
export class FourInARowService {
  game: FourInARowModel = {
    board: [
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
    ],
    currentPlayer: 'R',
    winner: null,
  };
  playerNames: { R: string; Y: string } = { R: 'Spelare 1', Y: 'Spelare 2' };

  public dropDisc(column: number): boolean {
    if (this.game.winner) return false;
    if (column < 0 || column >= this.game.board[0].length) return false;

    for (let row = this.game.board.length - 1; row >= 0; row--) {
      if (this.game.board[row][column] === null) {
        this.game.board[row][column] = this.game.currentPlayer;
        this.checkWinner(row, column);
        if (!this.game.winner) {
          this.game.currentPlayer = this.game.currentPlayer === 'R' ? 'Y' : 'R';
        }
        return true;
      }
    }
    return false;
  }

  private checkWinner(row: number, col: number): void {
    const directions = [
      { dr: 0, dc: 1 }, // horisontell
      { dr: 1, dc: 0 }, // vertikal
      { dr: 1, dc: 1 }, // diagonal \
      { dr: 1, dc: -1 }, // diagonal /
    ];

    const current = this.game.board[row][col];
    if (!current) return;

    for (const { dr, dc } of directions) {
      let count = 1;

      for (const dir of [-1, 1]) {
        let r = row + dr * dir;
        let c = col + dc * dir;

        while (
          r >= 0 &&
          r < this.game.board.length &&
          c >= 0 &&
          c < this.game.board[0].length &&
          this.game.board[r][c] === current
        ) {
          count++;
          r += dr * dir;
          c += dc * dir;
        }
      }

      if (count >= 4) {
        this.game.winner = current;
        return;
      }
    }
  }

  public resetGame(): void {
    this.game = {
      board: [
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
      ],
      currentPlayer: 'R',
      winner: null,
    };
  }
  public isBoardFull(): boolean {
    return this.game.board.every((row) => row.every((cell) => cell !== null));
  }
}
