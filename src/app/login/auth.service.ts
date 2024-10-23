import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthResponse } from './auth-response.model'; // ajuste o caminho conforme necessário

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://projeto-mobile-api.vercel.app/api/v1/auth/user';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.apiUrl, { email, password });
  }
}
