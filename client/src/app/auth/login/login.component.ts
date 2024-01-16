import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  @ViewChild('error', { static: true }) protected error!: ElementRef;

  protected username = new FormControl('');
  protected password = new FormControl('');

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['file-explorer']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  login() {
    const enteredUsername = this.username.value;
    const enteredPassword = this.password.value;

    if (enteredUsername && enteredPassword) {
      this.authService
        .login(enteredUsername, enteredPassword)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.authService.setAuthenticated();
            this.username.reset();
            this.password.reset();
            this.router.navigate(['file-explorer']);
          },
          error: (error) => {
            this.authService.setUnauthenticated();
            this.username.reset();
            this.password.reset();
            this.renderer.removeClass(this.error.nativeElement, 'hidden');
          },
        });
    }
  }
}
