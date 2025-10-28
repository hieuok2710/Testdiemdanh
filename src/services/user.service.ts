import { Injectable, signal } from '@angular/core';

export interface User {
  id: string;
  fullName: string;
  phone: string;
  registrationTime: Date;
  status: 'present' | 'absent';
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  readonly users = signal<User[]>([]);
  readonly generalPin = signal<string>('1234');

  setGeneralPin(pin: string) {
    this.generalPin.set(pin);
  }

  validatePin(pin: string): boolean {
    return this.generalPin() === pin;
  }

  registerUser(fullName: string, phone: string) {
    const newUser: User = {
      id: `MS-${Date.now().toString().slice(-6)}`,
      fullName: fullName,
      phone: phone,
      registrationTime: new Date(),
      status: 'present',
    };
    this.users.update(currentUsers => [...currentUsers, newUser]);
  }

  toggleUserStatus(userId: string) {
    this.users.update(currentUsers =>
      currentUsers.map(user =>
        user.id === userId
          ? { ...user, status: user.status === 'present' ? 'absent' : 'present' }
          : user
      )
    );
  }
}
