import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/services/api.service';
import { Login } from './login.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private apiService: ApiService) {}

  public login(username: string, password: string): Observable<any> {
    return this.apiService.post<any, Login>('auth/login', {
      username: username,
      password: password,
    });
  }
}
