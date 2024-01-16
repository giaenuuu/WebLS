import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  protected showNavbar = true;

  private destroy$ = new Subject<void>();

  constructor(protected authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.verifyAuthentication();
    this.authService.authenticated$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isAuth) => {
        this.showNavbar = isAuth;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  logout(): void {
    this.authService.authenticated$.next(false);
    this.router.navigate(['auth/logout']);
  }
}
