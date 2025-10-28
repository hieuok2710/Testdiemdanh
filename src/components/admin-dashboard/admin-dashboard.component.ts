import { Component, ChangeDetectionStrategy, output, inject, OnInit, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService, User } from '../../services/user.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, CommonModule],
})
export class AdminDashboardComponent implements OnInit {
  logout = output<void>();

  private fb = inject(FormBuilder);
  private userService = inject(UserService);

  users = this.userService.users;
  
  registrationUrl = computed(() => {
    const baseUrl = window.location.origin + window.location.pathname;
    const pin = this.userService.generalPin();
    return `${baseUrl}?view=register&pin=${pin}`;
  });

  qrCodeUrl = computed(() => `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(this.registrationUrl())}`);
  copied = signal(false);
  showAdminRegisterSuccess = signal(false);

  pinForm = this.fb.group({
    pin: ['', [Validators.required, Validators.pattern('^[0-9]{4,6}$')]],
  });
  
  adminRegisterForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    phone: ['', [Validators.required, Validators.pattern('^[0-9]{10,11}$')]],
  });

  get pin() {
    return this.pinForm.get('pin');
  }
  
  get adminFullName() {
    return this.adminRegisterForm.get('fullName');
  }

  get adminPhone() {
    return this.adminRegisterForm.get('phone');
  }

  ngOnInit() {
    this.pinForm.patchValue({ pin: this.userService.generalPin() });
  }

  setGeneralPin() {
    if (this.pinForm.invalid) {
      this.pinForm.markAllAsTouched();
      return;
    }
    this.userService.setGeneralPin(this.pinForm.value.pin!);
    alert('Mã pin chung đã được cập nhật!');
    this.pinForm.markAsPristine();
  }

  generateRandomPin() {
    const randomPin = Math.floor(100000 + Math.random() * 900000).toString();
    this.pinForm.patchValue({ pin: randomPin });
    // Immediately set the new pin in the service, which updates the URL and QR code
    this.userService.setGeneralPin(randomPin);
    this.pinForm.markAsPristine();
  }

  copyUrl() {
    navigator.clipboard.writeText(this.registrationUrl()).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2500);
    });
  }
  
  registerUserFromAdmin() {
    if (this.adminRegisterForm.invalid) {
      this.adminRegisterForm.markAllAsTouched();
      return;
    }
    const { fullName, phone } = this.adminRegisterForm.getRawValue();
    this.userService.registerUser(fullName!, phone!);
    this.adminRegisterForm.reset();
    
    this.showAdminRegisterSuccess.set(true);
    setTimeout(() => {
      this.showAdminRegisterSuccess.set(false);
    }, 3000);
  }

  toggleStatus(userId: string) {
    this.userService.toggleUserStatus(userId);
  }

  onLogout() {
    this.logout.emit();
  }
}
