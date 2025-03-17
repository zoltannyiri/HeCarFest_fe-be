import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VoteService {
  private apiUrl = 'http://localhost:8000/votes';  // A backend URL-je

  constructor(private http: HttpClient) {}

  getVotes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
