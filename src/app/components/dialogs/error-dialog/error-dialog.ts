import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule, DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';

export type ErrorDialogData = {
  title?: string;
  message: string;
};

@Component({
  selector: 'app-error-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule],
  templateUrl: './error-dialog.html',
  styleUrls: ['./error-dialog.css'],
})
export class ErrorDialogComponent {
  constructor(
    public ref: DialogRef<void>,
    @Inject(DIALOG_DATA) public data: ErrorDialogData
  ) {}

  close() {
    this.ref.close();
  }
}
