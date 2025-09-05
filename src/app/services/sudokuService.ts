import { inject, Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Sudoku } from "../models/sudoku.model";

@Injectable({providedIn: 'root'})

/*export class SudokuService {
    private http = inject(HttpClient);
    private apiKey = 'p2hwyeiZo4uM2Lfa0A26/Q==Yxfpem66xxm7L8T9';
    private baseUrl = 'https://api.api-ninjas.com/v1/sudokugenerate';

}
    */
@Injectable({ providedIn: 'root' })
export class SudokuService {
  private apiUrl = 'https://api.api-ninjas.com/v1/sudokugenerate';
  private headers = new HttpHeaders({
    'X-Api-Key': 'p2hwyeiZo4uM2Lfa0A26/Q==Yxfpem66xxm7L8T9' 
  });
  constructor(private http: HttpClient) {}

  getSudoku(difficulty: 'easy'|'medium'|'hard'|'random' = 'easy'): Observable<Sudoku> {
    return this.http.get<Sudoku>(`${this.apiUrl}?difficulty=${difficulty}`, { headers: this.headers });
  }
}