import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { ApiService } from '../core/services/api.service';
import { Login } from './login.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public authenticated$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private apiService: ApiService, private router: Router) {}

  public login(username: string, password: string): Observable<any> {
    const res = this.apiService.post<any, Login>('auth/login', {
      username: username,
      password: password,
    });
    return res;
  }

  public verifyAuthentication() {
    const res = this.apiService.get<any>('auth/verify');

    res.pipe(take(1)).subscribe({
      next: () => {
        this.setAuthenticated();
      },
      error: () => {
        this.setUnauthenticated();
      },
    });
  }

  public logout(): void {
    this.setUnauthenticated();
    const res = this.apiService.post<any, any>('auth/logout', '');
    res.pipe(take(1)).subscribe(() => {
      this.router.navigate(['auth/login']);
    });
  }

  public setAuthenticated(): void {
    this.authenticated$.next(true);
    localStorage.setItem('isAuthorized', 'true');
  }

  public setUnauthenticated(): void {
    this.authenticated$.next(false);
    localStorage.removeItem('isAuthorized');
  }

  public isAuthenticated(): boolean {
    const storedValue = localStorage.getItem('isAuthorized');
    if (storedValue) {
      this.authenticated$.next(true);
      return true;
    }
    this.authenticated$.next(false);
    return false;
  }
}
