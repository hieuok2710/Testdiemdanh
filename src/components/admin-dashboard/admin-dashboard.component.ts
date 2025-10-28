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
  registrationUrl = signal('');
  qrCodeUrl = computed(() => `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(this.registrationUrl())}`);
  copied = signal(false);

  pinForm = this.fb.group({
    pin: ['', [Validators.required, Validators.pattern('^[0-9]{4,6}$')]],
  });

  get pin() {
    return this.pinForm.get('pin');
  }

  ngOnInit() {
    this.pinForm.patchValue({ pin: this.userService.generalPin() });
    // Construct the registration URL that directs users to the register view
    const baseUrl = window.location.origin + window.location.pathname;
    this.registrationUrl.set(`${baseUrl}?view=register`);
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
    this.pinForm.markAsDirty();
  }

  copyUrl() {
    navigator.clipboard.writeText(this.registrationUrl()).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2500);
    });
  }

  toggleStatus(userId: string) {
    this.userService.toggleUserStatus(userId);
  }

  onLogout() {
    this.logout.emit();
  }
}
