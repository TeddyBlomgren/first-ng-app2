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
  loading = false;

  private manualMode = false;

  constructor(private api: WeatherService) {}

  ngOnInit(): void {
    this.loadByGeolocation();
  }
  loadByGeolocation() {
    if (!('geolocation' in navigator)) {
      this.error = 'Din webbläsare stöder inte platstjänster. Sök på en stad istället.';
      return;
    }

    if (this.manualMode) return;

    this.loading = true;
    this.error = '';

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        this.api.getWeatherByCoords(latitude, longitude).subscribe({
          next: (data) => {
            this.weather = data;
            this.city = data?.name ?? '';
            this.loading = false;
          },
          error: () => {
            this.error = 'Kunde inte hämta väder för din plats.';
            this.weather = null;
            this.loading = false;
          },
        });
      },
      (err) => {
        this.error =
          'Kunde inte få åtkomst till din plats. Tillåt platstjänster eller sök på en stad.';
        this.loading = false;
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60_000 }
    );
  }

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
