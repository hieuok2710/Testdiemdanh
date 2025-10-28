import { Component, ChangeDetectionStrategy, output, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register-form',
  imports: [ReactiveFormsModule],
  templateUrl: './register-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterFormComponent implements OnInit {
  switchToLogin = output<void>();
  showSuccessMessage = signal(false);

  private fb = inject(FormBuilder);
  private userService = inject(UserService);

  registerForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    phone: ['', [Validators.required, Validators.pattern('^[0-9]{10,11}$')]],
    pin: ['', [Validators.required, Validators.pattern('^[0-9]{4,6}$')]]
  });

  get fullName() {
    return this.registerForm.get('fullName');
  }

  get phone() {
    return this.registerForm.get('phone');
  }

  get pin() {
    return this.registerForm.get('pin');
  }

  ngOnInit() {
    const urlParams = new URLSearchParams(window.location.search);
    const pinParam = urlParams.get('pin');
    if (pinParam) {
      this.registerForm.patchValue({ pin: pinParam });
    }
  }

  register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { fullName, phone, pin } = this.registerForm.getRawValue();

    if (!this.userService.validatePin(pin!)) {
      this.pin?.setErrors({ invalidPin: true });
      alert('Mã PIN không hợp lệ. Vui lòng kiểm tra lại mã PIN do giáo viên cung cấp.');
      return;
    }

    this.userService.registerUser(fullName!, phone!);
    this.showSuccessMessage.set(true);

    setTimeout(() => {
      this.registerForm.reset();
      this.switchToLogin.emit();
      this.showSuccessMessage.set(false);
    }, 2000);
  }

  onSwitchToLogin() {
    this.switchToLogin.emit();
  }
}
