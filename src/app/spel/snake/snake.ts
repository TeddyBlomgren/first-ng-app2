import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './snake.html',
  styleUrls: ['./snake.css'],
})
export class AppComponent {
  score = 0;

  @ViewChild('screen', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;

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

    let xVelocity = CELL;
    let yVelocity = 0;

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
      const head = { x: snake[0].x + xVelocity, y: snake[0].y + yVelocity };
      snake.unshift(head);
    };

    const changeDirection = (e: KeyboardEvent) => {
      const LEFT = 37,
        UP = 38,
        RIGHT = 39,
        DOWN = 40;
      const goingUp = yVelocity === -CELL;
      const goingDown = yVelocity === CELL;
      const goingRight = xVelocity === CELL;
      const goingLeft = xVelocity === -CELL;

      switch (e.keyCode) {
        case LEFT:
          if (!goingRight) {
            xVelocity = -CELL;
            yVelocity = 0;
          }
          break;
        case RIGHT:
          if (!goingLeft) {
            xVelocity = CELL;
            yVelocity = 0;
          }
          break;
        case UP:
          if (!goingDown) {
            xVelocity = 0;
            yVelocity = -CELL;
          }
          break;
        case DOWN:
          if (!goingUp) {
            xVelocity = 0;
            yVelocity = CELL;
          }
          break;
      }
    };

    window.addEventListener('keydown', changeDirection);
    createFood();

    const loop = () => {
      if (gameOver) {
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
      setTimeout(loop, speed);
    };

    loop();
  }
}
