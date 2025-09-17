import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule, DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';

type InputData = {
  title?: string;
  message?: string;
  placeholder?: string;
  defaultValue?: string;
};

@Component({
  standalone: true,
  selector: 'app-input-dialog',
  imports: [CommonModule, FormsModule, DialogModule],
  templateUrl: './input-dialog.html',
  styleUrls: ['./input-dialog.css'],
})
export class InputDialogComponent {

  value: string = '';

  constructor(public ref: DialogRef<string | null>, @Inject(DIALOG_DATA) public data: InputData) {
    this.value = data.defaultValue ?? '';
  }

  ok() {
    const trimmed = this.value.trim();
    this.ref.close(trimmed.length > 0 ? trimmed : null);
  }
}
