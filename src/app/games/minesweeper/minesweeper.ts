import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { MinesweeperService, Difficulty } from '../../services/minesweeper.services';
import { Cell } from '../../models/minesweeper.models';

@Component({
  selector: 'app-minesweeper',
  imports: [NgFor, NgIf],
  standalone: true,
  templateUrl: './minesweeper.html',
  styleUrl: './minesweeper.css',
})
export class Minesweeper {
  Difficulty = Difficulty;
  constructor(public game: MinesweeperService) {}

  get board(): Cell[][] {
    return this.game.getBoard();
  }

  onLeftClick(r: number, c: number): void {
    this.game.reveal(r, c);
  }

  onRightClick(event: MouseEvent, r: number, c: number): void {
    event.preventDefault(); // hindra contextmenyn
    this.game.toggleFlag(r, c);
  }

  setDifficulty(diff: Difficulty): void {
    this.game.setDifficulty(diff);
  }

  reset(): void {
    this.game.reset();
  }
}
