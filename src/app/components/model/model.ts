import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './model.html',
  styleUrl: './model.css',
})
export class ModelComponent {
  @Input() title = 'Modal title';
  @Input() body = '';
  @Input() showInput = false;
  @Input() primaryButtonText = 'OK';
  @Input() secondaryButtonText = 'Close';

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
