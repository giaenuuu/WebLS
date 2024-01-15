import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  username = new FormControl('');
  password = new FormControl('');

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    const enteredUsername = this.username.value;
    const enteredPassword = this.password.value;

    if (enteredUsername && enteredPassword) {
      this.authService.login(enteredUsername, enteredPassword).subscribe({
        next: (response) => {
          this.username.reset();
          this.password.reset();
          this.router.navigate(['filesystem']);
        },
        error: (error) => {
          this.username.reset();
          this.password.reset();

          // Optionally display an error message to the user
        },
      });
    }
  }
}
