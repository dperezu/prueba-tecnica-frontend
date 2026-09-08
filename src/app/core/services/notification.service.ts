import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

const DURATION_MS = 3500;

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);

  success(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: DURATION_MS,
      panelClass: ['notification-success'],
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  error(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: DURATION_MS,
      panelClass: ['notification-error'],
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }
}
