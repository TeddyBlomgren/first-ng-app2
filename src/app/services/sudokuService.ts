import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sudoku } from '../models/sudoku.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SudokuService {
  private apiUrl = 'https://api.api-ninjas.com/v1/sudokugenerate';
  private headers = new HttpHeaders({
    'X-Api-Key': environment.sudokuApiKey,
  });
  constructor(private http: HttpClient) {}

  getSudoku(difficulty: 'easy' | 'medium' | 'hard' | 'random' = 'easy'): Observable<Sudoku> {
    return this.http.get<Sudoku>(`${this.apiUrl}?difficulty=${difficulty}`, {
      headers: this.headers,
    });
  }
}
