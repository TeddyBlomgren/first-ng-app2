import { Component } from '@angular/core';
import { TicTacToeService } from '../../services/ticTacToe.Services';
import { TicTacToe as TicTacToeModel } from '../../models/ticTacToe.models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tic-tac-toe',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tic-tac-toe.html',
  styleUrl: './tic-tac-toe.css',
})
export class TicTacToeComponent {
  game: TicTacToeModel;

  constructor(private ticTacToeService: TicTacToeService) {
    this.game = this.ticTacToeService.getGame();
  }

  play(row: number, col: number) {
    this.ticTacToeService.playMove(row, col);
  }

  reset() {
    this.ticTacToeService.resetGame();
    this.game = this.ticTacToeService.getGame();
  }

  winner() {
    this.ticTacToeService.checkWinner();
  }
}
