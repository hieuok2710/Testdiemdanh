import { Component, ChangeDetectionStrategy, output, inject, OnInit } from '@angular/core';
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

  pinForm = this.fb.group({
    pin: ['', [Validators.required, Validators.pattern('^[0-9]{4,6}$')]],
  });

  get pin() {
    return this.pinForm.get('pin');
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
    // Generates a random 6-digit PIN
    const randomPin = Math.floor(100000 + Math.random() * 900000).toString();
    this.pinForm.patchValue({ pin: randomPin });
    this.pinForm.markAsDirty();
  }

  toggleStatus(userId: string) {
    this.userService.toggleUserStatus(userId);
  }

  onLogout() {
    this.logout.emit();
  }
}