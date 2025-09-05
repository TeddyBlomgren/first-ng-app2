import { inject, Inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({providedIn: 'root'})

export class SudokuService {
    private http = inject(HttpClient);
    private apiKey = 'p2hwyeiZo4uM2Lfa0A26/Q==Yxfpem66xxm7L8T9';
    private baseUrl = 'https://api.api-ninjas.com/v1/sudokugenerate';
    
}