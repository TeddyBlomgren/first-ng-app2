import { Injectable } from '@angular/core';

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

  private initGame(): void {
    const pairs = ['🍒', '🍇', '🍍', '🍓', '🍎', '🍌'];
    this.cards = this.buildDeck(pairs);
    this.totalPairs = pairs.length;
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
  /** Får kortet vändas nu? */
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

    // om två uppe -> jämför
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
