import { Component } from '@angular/core';

import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-spel',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './games.html',
  styleUrls: ['./games.css'],
})
export class SpelComponent {
  games: any[] = [];

  constructor(private router: Router) {
    this.games = this.router.config.filter((route) => route.data);
  }
}
