import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class ModalComponent {
  @Input() title = 'Modal title';
  @Input() body = '';

  @Input() showInput = false;
  @Input() showSecButton = false;
  @Input() primaryButtonText = 'OK';
  @Input() secondaryButtonText = 'Close';

  @Input() firstBtnColor: 'primary' | 'secondary' | 'warning' | 'danger' | 'success' | 'info' =
    'primary';
  @Input() secBtnColor: 'primary' | 'secondary' | 'warning' | 'danger' | 'success' | 'info' =
    'secondary';
  @Input() titleColor: 'primary' | 'danger' | 'warning' | 'success' | 'dark' = 'dark';
  @Input() textColor: 'primary' | 'danger' | 'warning' | 'success' | 'dark' = 'dark';

  @Input() inputDefaultValue = '';
  @Input() inputPlaceholder = 'Titel';

  @Output() primaryAction = new EventEmitter<string>();
  @Output() secondaryAction = new EventEmitter<void>();

  inputValue = '';

  onPrimaryClick() {
    this.primaryAction.emit(this.inputValue);
  }

  onSecondaryClick() {
    this.secondaryAction.emit();
  }
}
