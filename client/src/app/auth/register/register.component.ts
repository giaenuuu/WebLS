import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  @ViewChild('error', { static: true }) protected error!: ElementRef;

  protected username = new FormControl('');
  protected password = new FormControl('');
  protected passwordVerify = new FormControl('');
  protected errors: string[] = [];

  private destroy$ = new Subject<void>();
  private passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+-])[A-Za-z\d!@#$%^&*()_+-]+$/;
  private nameRegex = /^[a-zA-Z]+$/;

  constructor(
    private authService: AuthService,
    private router: Router,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  login() {
    this.errors = [];

    const enteredUsername = this.username.value;
    const enteredPassword = this.password.value;
    const enteredPasswordVerify = this.passwordVerify.value;

    if (!enteredUsername || enteredUsername === '') {
      this.errors.push('Username must be filled out');
    } else {
      if (enteredUsername.length < 4) {
        this.errors.push('Username must be at least 4 characters long');
      }
      if (!this.nameRegex.test(enteredUsername)) {
        this.errors.push(
          'Username can only consist of upper and lower case letters'
        );
      }
    }

    if (!enteredPassword || enteredPassword === '') {
      this.errors.push('Password must be filled out');
    } else {
      if (enteredPassword.length < 8) {
        this.errors.push('Password must be at least 8 characters long');
      }
      if (!this.passwordRegex.test(enteredPassword)) {
        this.errors.push(
          'Password must include one of each allowed groups: a-z, A-Z, 0-9, !@#$%^&*()_+-'
        );
      }
    }

    if (!enteredPasswordVerify || enteredPasswordVerify === '') {
      this.errors.push('Password must be verified');
    } else {
      if (enteredPasswordVerify !== enteredPassword) {
        this.errors.push('Passwords do not match');
      }
    }

    if (this.errors.length <= 0) {
      this.authService
        .register(enteredUsername!, enteredPassword!)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.username.reset();
            this.password.reset();
            this.passwordVerify.reset();
          },
          error: (error) => {
            this.username.reset();
            this.password.reset();
            this.passwordVerify.reset();
            this.errors.push(`Server: ${error}`);
            this.renderer.removeClass(this.error.nativeElement, 'hidden');
          },
        });
    } else {
      this.username.reset();
      this.password.reset();
      this.passwordVerify.reset();
      this.renderer.removeClass(this.error.nativeElement, 'hidden');
    }
  }
}
