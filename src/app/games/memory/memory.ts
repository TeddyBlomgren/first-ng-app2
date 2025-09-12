import { Component } from '@angular/core';
import { MemoryService } from '../../services/memory.services';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-memory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './memory.html',
  styleUrls: ['./memory.css'],
})
export class MemoryComponent {
  difficulty: 'easy' | 'medium' | 'hard' = 'easy';
  private readonly pairsByDiff: Record<string, number> = {
    easy: 4,
    medium: 6,
    hard: 8,
  };

  constructor(public memory: MemoryService) {}

  onCardClick(i: number) {
    this.memory.handleCard(i);
  }

  onReset() {
    this.memory.resetGame();
  }
  setDifficulty(level: 'easy' | 'medium' | 'hard') {
    this.difficulty = level;
    this.memory.totalPairs = this.pairsByDiff[level];
    this.onReset();
  }
}
