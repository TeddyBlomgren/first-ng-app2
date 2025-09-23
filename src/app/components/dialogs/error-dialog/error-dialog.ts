import { Component, ViewEncapsulation, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule, DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { ModalComponent } from '../../modal/modal';

export type ErrorDialogData = {
  title?: string;
  message: string;
};

@Component({
  selector: 'app-error-dialog',
  standalone: true,
  imports: [ModalComponent],
  templateUrl: './error-dialog.html',
  styleUrls: ['./error-dialog.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ErrorDialogComponent {
  constructor(public ref: DialogRef<void>, @Inject(DIALOG_DATA) public data: ErrorDialogData) {}

  close() {
    this.ref.close();
  }
}
