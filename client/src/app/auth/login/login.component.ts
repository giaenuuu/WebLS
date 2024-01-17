import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, combineLatest, map, takeUntil } from 'rxjs';
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
  protected buttonDisabled = true;

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['filesystem']);
    }
    combineLatest([this.username.valueChanges, this.password.valueChanges])
      .pipe(
        map(([usernameValue, passwordValue]) => {
          // Check if either username or password is empty
          return usernameValue?.trim() === '' || passwordValue?.trim() === '';
        })
      )
      .subscribe((isEmpty) => {
        // Update buttonDisabled based on whether either is empty
        this.buttonDisabled = isEmpty;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('document:keydown.enter', ['$event'])
  handleEnterKey(event: KeyboardEvent): void {
    // Check if the Enter key was pressed while the focus is inside the form
    if (event.target instanceof HTMLInputElement) {
      this.login();
    }
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
            this.router.navigate(['filesystem']);
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
