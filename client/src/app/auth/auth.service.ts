import { Injectable } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { Login } from './login.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private apiService: ApiService) {}

  public login(username: string, password: string) {
    this.apiService.post<any, Login>('auth/login', {
      username: username,
      password: password,
    });
  }
}
