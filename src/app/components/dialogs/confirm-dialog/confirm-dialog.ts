import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule, DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';

type ConfirmData = { title?: string; message: string; confirmText?: string; cancelText?: string };

@Component({
  standalone: true,
  selector: 'app-confirm-dialog',
  imports: [CommonModule, DialogModule],
  template: `
    <div class="dialog">
      <h2>{{ data.title || 'Bekräfta' }}</h2>
      <p>{{ data.message }}</p>
      <div class="actions">
        <button type="button" (click)="ref.close(false)">{{ data.cancelText || 'Nej' }}</button>
        <button type="button" (click)="ref.close(true)">{{ data.confirmText || 'Ja' }}</button>
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
    `,
  ],
})
export class ConfirmDialogComponent {
  constructor(public ref: DialogRef<boolean>, @Inject(DIALOG_DATA) public data: ConfirmData) {}
}
