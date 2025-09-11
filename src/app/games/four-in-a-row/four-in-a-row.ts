import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FourInARowService } from '../../services/four-in-a-row';
import { FourInARow as FourInARowstate } from '../../models/four-in-a-row.models';

@Component({
  selector: 'app-four-in-a-row',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './four-in-a-row.html',
  styleUrl: './four-in-a-row.css',
})
export class FourInARowComponent {
  public four = inject(FourInARowService);
  get game(): FourInARowstate {
    return this.four.game;
  }

  constructor(public fourInARowService: FourInARowService) {}

  play(col: number) {
    this.fourInARowService.dropDisc(col);
  }
  reset() {
    this.fourInARowService.resetGame();
  }

  isBoardFull(): boolean {
    return this.game.board.every((row) => row.every((cell) => cell !== null));
  }
}
