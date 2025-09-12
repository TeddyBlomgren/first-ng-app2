import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './snake.html',
  styleUrls: ['./snake.css'],
})
export class SnakeComponent {
  score = 0;

  @ViewChild('screen', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;
  private readonly CELL = 20;
  private xVelocity = this.CELL;
  private yVelocity = 0;

  private startGameFn: (() => void) | null = null;
  public changeDirectionButton(direction: 'up' | 'down' | 'left' | 'right') {
    const goingUp = this.yVelocity === -this.CELL;
    const goingDown = this.yVelocity === this.CELL;
    const goingRight = this.xVelocity === this.CELL;
    const goingLeft = this.xVelocity === -this.CELL;

    switch (direction) {
      case 'up':
        if (!goingDown) {
          this.xVelocity = 0;
          this.yVelocity = -this.CELL;
        }
        break;
      case 'down':
        if (!goingUp) {
          this.xVelocity = 0;
          this.yVelocity = this.CELL;
        }
        break;
      case 'left':
        if (!goingRight) {
          this.xVelocity = -this.CELL;
          this.yVelocity = 0;
        }
        break;
      case 'right':
        if (!goingLeft) {
          this.xVelocity = this.CELL;
          this.yVelocity = 0;
        }
        break;
    }
  }
  public startGame() {
    this.startGameFn?.();
  }

  ngAfterViewInit() {
    const canvas = this.canvas.nativeElement;

    const cssW = canvas.clientWidth;
    const cssH = canvas.clientHeight;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);

    const ctx = canvas.getContext('2d')!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const CELL = 20;
    const COLS = Math.floor(cssW / CELL);
    const ROWS = Math.floor(cssH / CELL);

    let gameOver = false;
    let speed = 250;
    this.score = 0;

    let snake = [
      { x: CELL * 4, y: 0 },
      { x: CELL * 3, y: 0 },
      { x: CELL * 2, y: 0 },
      { x: CELL * 1, y: 0 },
      { x: CELL * 0, y: 0 },
    ];

    let gamInterval: number | null = null; // använder både loop ocg interval
    let isGameRunning = false;

    let foodX = 0;
    let foodY = 0;

    const createFood = () => {
      do {
        foodX = Math.floor(Math.random() * COLS) * CELL;
        foodY = Math.floor(Math.random() * ROWS) * CELL;
      } while (snake.some((p) => p.x === foodX && p.y === foodY));
    };

    const drawSnake = () => {
      ctx.fillStyle = 'black';
      for (const p of snake) ctx.fillRect(p.x, p.y, CELL, CELL);
    };

    const drawFood = () => {
      ctx.fillStyle = 'red';
      ctx.fillRect(foodX, foodY, CELL, CELL);
    };

    const checkGameOver = () => {
      const head = snake[0];
      if (head.x < 0 || head.x >= cssW || head.y < 0 || head.y >= cssH) {
        gameOver = true;
        return;
      }
      for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
          gameOver = true;
          return;
        }
      }
    };

    const moveSnake = () => {
      const head = { x: snake[0].x + this.xVelocity, y: snake[0].y + this.yVelocity };
      snake.unshift(head);
    };

    const changeDirectionButton = (direction: 'up' | 'down' | 'left' | 'right') => {
      const goingUp = this.yVelocity === -CELL;
      const goingDown = this.yVelocity === CELL;
      const goingRight = this.xVelocity === CELL;
      const goingLeft = this.xVelocity === -CELL;
      switch (direction) {
        case 'up':
          if (!goingDown) {
            this.xVelocity = 0;
            this.yVelocity = -CELL;
          }
          break;
        case 'down':
          if (!goingUp) {
            this.xVelocity = 0;
            this.yVelocity = CELL;
          }
          break;
        case 'left':
          if (!goingRight) {
            this.xVelocity = -CELL;
            this.yVelocity = 0;
          }
          break;
        case 'right':
          if (!goingLeft) {
            this.xVelocity = CELL;
            this.yVelocity = 0;
          }
          break;
      }
    };

    const changeDirection = (e: KeyboardEvent) => {
      const goingUp = this.yVelocity === -CELL;
      const goingDown = this.yVelocity === CELL;
      const goingRight = this.xVelocity === CELL;
      const goingLeft = this.xVelocity === -CELL;

      switch (e.key.toLowerCase()) {
        case 'a':
          if (!goingRight) {
            this.xVelocity = -CELL;
            this.yVelocity = 0;
          }
          break;
        case 'd':
          if (!goingLeft) {
            this.xVelocity = CELL;
            this.yVelocity = 0;
          }
          break;
        case 'w':
          if (!goingDown) {
            this.xVelocity = 0;
            this.yVelocity = -CELL;
          }
          break;
        case 's':
          if (!goingUp) {
            this.xVelocity = 0;
            this.yVelocity = CELL;
          }
          break;
      }
    };

    window.addEventListener('keydown', changeDirection);
    createFood();

    // --- Huvudloopen startas först när du klickar Start
    const loop = () => {
      if (gameOver) {
        isGameRunning = false;
        if (confirm('Game Over!')) location.reload();
        return;
      }

      checkGameOver();
      ctx.clearRect(0, 0, cssW, cssH);
      ctx.fillStyle = 'lightgray';
      ctx.fillRect(0, 0, cssW, cssH);

      drawFood();
      moveSnake();

      if (snake[0].x === foodX && snake[0].y === foodY) {
        this.score++;
        createFood();
        if (this.score > 5) speed = 225;
        if (this.score > 10) speed = 200;
        if (this.score > 15) speed = 175;
        if (this.score > 20) speed = 150;
        if (this.score > 30) speed = 125;
        if (this.score > 40) speed = 100;
      } else {
        snake.pop();
      }

      drawSnake();
      if (isGameRunning) setTimeout(loop, speed);
    };

    const startGameLocal = () => {
      if (isGameRunning) return;
      isGameRunning = true;

      snake = [
        { x: 80, y: 0 },
        { x: 60, y: 0 },
        { x: 40, y: 0 },
      ];
      this.xVelocity = CELL;
      this.yVelocity = 0;
      this.score = 0;
      gameOver = false;
      speed = 250;

      loop();
    };
    this.startGameFn = startGameLocal;
  }
}
