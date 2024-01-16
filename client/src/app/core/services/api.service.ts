// api.service.ts

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = '/api';

  constructor(private http: HttpClient) {}

  public get<T>(endpoint: string): Observable<T> {
    const url = `${this.baseUrl}/${endpoint}`;
    return this.http
      .get<T>(url, { headers: this.getRequestHeaders() })
      .pipe(catchError(this.handleError));
  }

  public post<T, D>(endpoint: string, data: D): Observable<T> {
    const url = `${this.baseUrl}/${endpoint}`;
    return this.http
      .post<T>(url, data, { headers: this.getRequestHeaders() })
      .pipe(catchError(this.handleError));
  }

  public put<T, D>(endpoint: string, data: D): Observable<T> {
    const url = `${this.baseUrl}/${endpoint}`;
    return this.http
      .put<T>(url, data, { headers: this.getRequestHeaders() })
      .pipe(catchError(this.handleError));
  }

  public delete<T>(endpoint: string): Observable<T> {
    const url = `${this.baseUrl}/${endpoint}`;
    return this.http
      .delete<T>(url, { headers: this.getRequestHeaders() })
      .pipe(catchError(this.handleError));
  }

  private getRequestHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      // Add any additional headers here
    });
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    if (error.statusCode == 401) {
    }
    return Promise.reject(error.message || error);
  }
}
