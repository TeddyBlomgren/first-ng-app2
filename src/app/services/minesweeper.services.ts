import { Injectable } from '@angular/core';
import { Cell } from '../models/minesweeper.models';

export enum Difficulty {
  Easy = 'easy',
  Medium = 'medium',
  Hard = 'hard',
}

@Injectable({ providedIn: 'root' })
export class MinesweeperService {
  // Presets för svårigheter
  static readonly PRESETS: Record<Difficulty, { rows: number; cols: number; minePercent: number }> =
    {
      [Difficulty.Easy]: { rows: 8, cols: 8, minePercent: 0.12 },
      [Difficulty.Medium]: { rows: 12, cols: 12, minePercent: 0.16 },
      [Difficulty.Hard]: { rows: 16, cols: 16, minePercent: 0.2 },
    };

  private rows = 8;
  private cols = 8;
  private mines = 10;
  private difficulty: Difficulty = Difficulty.Easy;
  private board: Cell[][] = [];

  private gameOver = false;
  private firstClick = true;
  private revealedCount = 0;

  constructor() {
    this.reset();
  }

  // Byt svårighet och resetta spelet
  setDifficulty(diff: Difficulty): void {
    this.difficulty = diff;
    const preset = MinesweeperService.PRESETS[diff];
    this.rows = preset.rows;
    this.cols = preset.cols;

    const total = this.rows * this.cols;
    const wanted = Math.round(total * preset.minePercent);
    this.mines = Math.min(Math.max(1, wanted), total - 1);

    this.reset();
  }

  // Nollställer bräde och status
  reset(): void {
    this.board = this.generateBoard();
    this.gameOver = false;
    this.firstClick = true;
    this.revealedCount = 0;
  }

  // Skapa tomt bräde
  private generateBoard(): Cell[][] {
    const board: Cell[][] = Array.from({ length: this.rows }, () =>
      Array.from(
        { length: this.cols },
        (): Cell => ({
          hasMine: false,
          isRevealed: false,
          isFlagged: false,
          adjacentMines: 0,
        })
      )
    );

    // Placera minor
    let placed = 0;
    while (placed < this.mines) {
      const r = Math.floor(Math.random() * this.rows);
      const c = Math.floor(Math.random() * this.cols);
      if (!board[r][c].hasMine) {
        board[r][c].hasMine = true;
        placed++;
      }
    }

    // Räkna siffror
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (!board[r][c].hasMine) {
          board[r][c].adjacentMines = this.countAdjacentMines(board, r, c);
        } else {
          board[r][c].adjacentMines = 0;
        }
      }
    }

    return board;
  }

  // Antal miner kring (row,col)
  private countAdjacentMines(board: Cell[][], row: number, col: number): number {
    let count = 0;
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = row + dr,
          nc = col + dc;
        if (this.inBounds(nr, nc) && board[nr][nc].hasMine) count++;
      }
    }
    return count;
  }

  reveal(r: number, c: number): void {
    if (this.gameOver) return;
    const cell = this.getCell(r, c);
    if (!cell || cell.isRevealed || cell.isFlagged) return;

    // QoL: första klicket är alltid säkert
    if (this.firstClick && cell.hasMine) {
      this.moveMineAway(r, c);

      for (let rr = 0; rr < this.rows; rr++) {
        for (let cc = 0; cc < this.cols; cc++) {
          if (!this.board[rr][cc].hasMine) {
            this.board[rr][cc].adjacentMines = this.countAdjacentMines(this.board, rr, cc);
          } else {
            this.board[rr][cc].adjacentMines = 0;
          }
        }
      }
    }
    this.firstClick = false;

    this.floodReveal(r, c);

    // Kolla vinst om vi inte redan förlorat
    if (!this.gameOver && this.checkWin()) {
      this.gameOver = true;
    }
  }

  toggleFlag(r: number, c: number): void {
    if (this.gameOver) return;
    const cell = this.getCell(r, c);
    if (!cell || cell.isRevealed) return;
    cell.isFlagged = !cell.isFlagged;
  }

  isGameOver(): boolean {
    return this.gameOver;
  }

  private floodReveal(r: number, c: number): void {
    const stack: Array<[number, number]> = [[r, c]];
    while (stack.length) {
      const [cr, cc] = stack.pop()!;
      const cell = this.getCell(cr, cc);
      if (!cell || cell.isRevealed || cell.isFlagged) continue;

      cell.isRevealed = true;
      if (cell.hasMine) {
        this.gameOver = true;
        continue;
      }

      this.revealedCount++;

      if (cell.adjacentMines === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = cr + dr,
              nc = cc + dc;
            const neigh = this.getCell(nr, nc);
            if (neigh && !neigh.isRevealed && !neigh.isFlagged && !neigh.hasMine) {
              stack.push([nr, nc]);
            }
          }
        }
      }
    }
  }

  private moveMineAway(r: number, c: number): void {
    this.board[r][c].hasMine = false;
    for (let rr = 0; rr < this.rows; rr++) {
      for (let cc = 0; cc < this.cols; cc++) {
        if (!this.board[rr][cc].hasMine && !(rr === r && cc === c)) {
          this.board[rr][cc].hasMine = true;
          return;
        }
      }
    }
  }

  private checkWin(): boolean {
    const totalSafe = this.rows * this.cols - this.mines;
    return this.revealedCount >= totalSafe;
  }

  private inBounds(r: number, c: number): boolean {
    return r >= 0 && r < this.rows && c >= 0 && c < this.cols;
  }

  getCell(r: number, c: number): Cell | null {
    return this.inBounds(r, c) ? this.board[r][c] : null;
  }

  getBoard(): Cell[][] {
    return this.board;
  }
  getRows(): number {
    return this.rows;
  }
  getCols(): number {
    return this.cols;
  }
  getMines(): number {
    return this.mines;
  }
  getDifficulty(): Difficulty {
    return this.difficulty;
  }
}
