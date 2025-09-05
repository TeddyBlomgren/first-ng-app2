import { inject, Inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({providedIn: 'root'})
export class VaderService {
    private http = inject(HttpClient);
    private apiKey = '1f0fb1c8f733b4b38d86c0856788f4fa';
    private baseUrl = 'https://api.openweathermap.org/data/2.5';
}
