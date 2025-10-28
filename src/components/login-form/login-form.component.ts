import { Component, ChangeDetectionStrategy, output, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule],
  templateUrl: './login-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent {
  switchToRegister = output<void>();
  loginSuccess = output<{ username: string }>();

  private fb = inject(FormBuilder);

  loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      console.log('Login form is invalid');
      return;
    }

    const { username, password } = this.loginForm.getRawValue();

    if (username === 'admin' && password === 'admin@##') {
      this.loginSuccess.emit({ username: username! });
      this.loginForm.reset();
    } else {
      console.log('Login submitted:', this.loginForm.value);
      alert('Đăng nhập thành công! (Chức năng admin chỉ dành cho tài khoản "admin")');
      this.loginForm.reset();
    }
  }

  onSwitchToRegister() {
    this.switchToRegister.emit();
  }
}
