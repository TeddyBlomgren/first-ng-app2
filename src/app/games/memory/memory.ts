import { Component } from '@angular/core';
import { MemoryService } from '../../services/memory.services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-memory',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './memory.html',
  styleUrls: ['./memory.css'],
})
export class MemoryComponent {
  constructor(public memory: MemoryService) {}

  onCardClick(i: number) {
    this.memory.handleCard(i);
  }

  onReset() {
    this.memory.resetGame();
  }
}
