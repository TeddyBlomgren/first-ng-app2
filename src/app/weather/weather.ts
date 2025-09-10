import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WeatherService } from '../services/weather.service';
import { Weathermodels } from '../models/weather.models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-weather',
  imports: [CommonModule, FormsModule],
  templateUrl: './weather.html',
  styleUrl: './weather.css',
  standalone: true,
})
export class weatherComponent {
  city: string = '';
  weather: Weathermodels | null = null;
  error: string = '';

  constructor(private api: WeatherService) {}

  search() {
    if (!this.city.trim()) {
      this.error = 'Ange en stad.';
      this.weather = null;
      return;
    }

    this.api.getWeather(this.city.trim()).subscribe({
      next: (data) => {
        this.weather = data;
        this.error = '';
      },
      error: (err) => {
        this.error = 'Kunde inte hämta väderdata. Kontrollera stadens namn.';
        this.weather = null;
      },
    });
  }
}
