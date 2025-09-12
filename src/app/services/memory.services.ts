import { Injectable } from '@angular/core';

type Level = 'easy' | 'medium' | 'hard';

@Injectable({ providedIn: 'root' })
export class MemoryService {
  cards: string[] = [];
  flippedCards: number[] = [];
  matchedCards: number[] = [];
  moves = 0;
  pairsFound = 0;
  totalPairs = 0;
  gameWon = false;

  private isResolving = false;

  private readonly PAIRS_BY_LEVEL: Record<Level, string[]> = {
    easy: ['🍒', '🍇', '🍍', '🍓'],
    medium: ['🍒', '🍇', '🍍', '🍓', '🍎', '🍌'],
    hard: ['🍒', '🍇', '🍍', '🍓', '🍎', '🍌', '🥝', '🍉'],
  };

  private selectedPairs: string[] = this.PAIRS_BY_LEVEL.easy;

  constructor() {
    this.resetGame();
  }

  private buildDeck(pairs: string[]): string[] {
    const deck = [...pairs, ...pairs];
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  setDifficulty(level: Level): void {
    this.selectedPairs = this.PAIRS_BY_LEVEL[level];
    this.resetGame();
  }

  private initGame(): void {
    this.cards = this.buildDeck(this.selectedPairs);
    this.totalPairs = this.selectedPairs.length;
  }

  resetGame(): void {
    this.initGame();
    this.flippedCards = [];
    this.matchedCards = [];
    this.moves = 0;
    this.pairsFound = 0;
    this.gameWon = false;
    this.isResolving = false;
  }

  private canFlip(index: number): boolean {
    return (
      !this.isResolving &&
      this.flippedCards.length < 2 &&
      !this.flippedCards.includes(index) &&
      !this.matchedCards.includes(index)
    );
  }

  handleCard(index: number): void {
    if (!this.canFlip(index)) return;

    this.flippedCards = [...this.flippedCards, index];

    if (this.flippedCards.length === 2) {
      this.isResolving = true;
      this.moves++;

      const [a, b] = this.flippedCards;
      const isMatch = this.cards[a] === this.cards[b];

      if (isMatch) {
        this.matchedCards = [...this.matchedCards, a, b];
        this.pairsFound++;
        this.flippedCards = [];
        this.isResolving = false;
        if (this.pairsFound === this.totalPairs) this.gameWon = true;
      } else {
        setTimeout(() => {
          this.flippedCards = [];
          this.isResolving = false;
        }, 800);
      }
    }
  }

  isFlipped(i: number): boolean {
    return this.flippedCards.includes(i) || this.matchedCards.includes(i);
  }
}
