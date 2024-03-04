import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) { }

  login(username: string, password: string) {
    return this.http.post<any>('/api/auth/login', { username, password}, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(
      map((token) => {
        localStorage.setItem('todo-token', token.access_token);
        return token;
      })
    ).pipe(
      catchError(error => {
        console.log("FAILED to authenticate", error);
        return throwError(() => error);
      })
    )
  }
}
