import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-spel',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './games.html',
  styleUrls: ['./games.css'],
})
export class SpelComponent {}
