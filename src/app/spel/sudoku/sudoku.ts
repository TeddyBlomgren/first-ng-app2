import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sudoku } from '../../models/sudoku.model';
import { SudokuService } from '../../services/sudokuService';

type Difficulty = 'easy' | 'medium' | 'hard' | 'random';

@Component({
  selector: 'app-sudoku',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sudoku.html',
  styleUrls: ['./sudoku.css'],
})
export class SudokuComponent {
  difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'random'];
  selectedDifficulty: Difficulty = 'easy';

  sudoku?: Sudoku;
  givenMask: boolean[][] = [];
  mistakes = 0;

  loading = false;
  error = '';

  constructor(private sudokuService: SudokuService) {}

  private resolveDifficulty(d: Difficulty): Exclude<Difficulty, 'random'> {
    if (d !== 'random') return d;
    const pool: Array<'easy' | 'medium' | 'hard'> = ['easy', 'medium', 'hard'];
    return pool[Math.floor(Math.random() * pool.length)];
  }

  private buildGivenMask(grid: number[][]) {
    this.givenMask = grid.map((row) => row.map((v) => v !== 0));
  }

  load(): void {
    const diff = this.resolveDifficulty(this.selectedDifficulty);

    this.loading = true;
    this.error = '';
    this.sudoku = undefined;

    this.sudokuService.getSudoku(diff).subscribe({
      next: (data: any) => {
        const puzzle = data?.puzzle;
        const solution = data?.solution;

        const is9x9 =
          Array.isArray(puzzle) &&
          puzzle.length === 9 &&
          puzzle.every((r: unknown) => Array.isArray(r) && (r as unknown[]).length === 9);

        if (!is9x9) {
          this.error = 'Felaktigt Sudokuformat från API.';
          this.loading = false;
          return;
        }

        const grid: number[][] = (puzzle as (number | null)[][]).map((row) =>
          row.map((v) => (v == null ? 0 : v))
        );

        this.sudoku = {
          grid,
          solution,
          difficulty: diff,
        };

        this.buildGivenMask(grid);
        this.mistakes = 0;
        this.loading = false;
      },
      error: (err) => {
        console.error('Kunde inte hämta Sudoku:', err);
        this.error = 'Kunde inte hämta Sudoku.';
        this.loading = false;
      },
    });
  }

  // Visa tom ruta för 0
  cellText(n: number): string {
    return n === 0 ? '' : String(n);
  }

  onCellInput(r: number, c: number, raw: string) {
    if (!this.sudoku) return;
    if (this.givenMask[r][c]) return;

    const trimmed = raw.trim();

    // Tillåt tomt (=0) eller ett tecken 1–9
    if (trimmed === '') {
      this.sudoku.grid[r][c] = 0;
      return;
    }
    const n = Number(trimmed);
    if (!Number.isInteger(n) || n < 1 || n > 9) return;

    this.sudoku.grid[r][c] = n;

    // snabb kontroll mot solution om den finns
    if (this.sudoku.solution) {
      const correct = this.sudoku.solution[r][c] === n;
      if (!correct) this.mistakes++;
    }
  }

  trackRow = (_: number, __: number[]) => _;
  trackCol = (_: number, __: number) => _;
}
