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
  template: `
    <div class="dialog">
      <h2>{{ data.title || 'Ny händelse' }}</h2>
      <p *ngIf="data.message">{{ data.message }}</p>

      <input
        [(ngModel)]="value"
        [placeholder]="data.placeholder || 'Titel'"
        (keyup.enter)="ok()"
        autofocus
      />

      <div class="actions">
        <button type="button" (click)="ref.close(null)">Avbryt</button>
        <button type="button" (click)="ok()">OK</button>
      </div>
    </div>
  `,
  styles: [
    `
      .dialog {
        background: #fff;
        border-radius: 12px;
        padding: 16px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
        max-width: 420px;
      }
      .actions {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
        margin-top: 16px;
      }
      input {
        width: 100%;
        padding: 8px;
        box-sizing: border-box;
      }
    `,
  ],
})
export class InputDialogComponent {
<<<<<<< HEAD

=======
>>>>>>> 558003ed5d6eb7fe41743656f294a520185eac7b
  value: string = '';

  constructor(public ref: DialogRef<string | null>, @Inject(DIALOG_DATA) public data: InputData) {
    this.value = data.defaultValue ?? '';
  }

  ok() {
    const trimmed = this.value.trim();
    this.ref.close(trimmed.length > 0 ? trimmed : null);
  }
}
