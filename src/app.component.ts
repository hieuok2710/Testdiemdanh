import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoginFormComponent, RegisterFormComponent, AdminDashboardComponent],
})
export class AppComponent {
  view = signal<'login' | 'register' | 'admin'>('login');

  switchToRegister() {
    this.view.set('register');
  }

  switchToLogin() {
    this.view.set('login');
  }

  handleLoginSuccess(user: { username: string }) {
    if (user.username === 'admin') {
      this.view.set('admin');
    }
    // Logic for other users is handled within the login component for now
  }

  handleLogout() {
    this.view.set('login');
  }
}
