import { inject, Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Vader } from '../vader/vader';

@Injectable({ providedIn: 'root' })
export class VaderService {
  private apiUrl = 'https://api.openweathermap.org/data/2.5';
  private headers = new HttpHeaders({
    'X-Api-Key': '1f0fb1c8f733b4b38d86c0856788f4fa',
  });

  constructor(private http: HttpClient) {}
}
