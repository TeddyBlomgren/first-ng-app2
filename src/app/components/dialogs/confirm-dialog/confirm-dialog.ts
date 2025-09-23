import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule, DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { ModalComponent } from '../../modal/modal';

type ConfirmData = { title?: string; message: string; confirmText?: string; cancelText?: string };

@Component({
  standalone: true,
  selector: 'app-confirm-dialog',
  imports: [CommonModule, DialogModule, ModalComponent],
  templateUrl: './confirm-dialog.html',
  styleUrls: ['./confirm-dialog.css'],
})
export class ConfirmDialogComponent {
  constructor(public ref: DialogRef<boolean>, @Inject(DIALOG_DATA) public data: ConfirmData) {}

  confirm() {
    this.ref.close(true);
  }
  close() {
    this.ref.close(false);
  }
}
