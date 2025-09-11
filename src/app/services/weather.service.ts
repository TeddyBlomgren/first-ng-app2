import { inject, Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Weathermodels } from '../models/weather.models';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private apiUrl = 'https://api.openweathermap.org/data/2.5';

  constructor(private http: HttpClient) {}
  getWeather(city: string): Observable<Weathermodels> {
    return this.http.get<Weathermodels>(`${this.apiUrl}/weather`, {
      params: {
        q: city,
        appid: environment.weatherapiKey,
        units: 'metric',
        lang: 'sv',
      },
    });
  }
}
