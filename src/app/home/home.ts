import { Component, input, signal } from '@angular/core';
import { Greeting } from '../components/greeting/greeting';
import { Counter } from '../components/counter/counter';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [Greeting, Counter, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  standalone: true,
})
export class Home {
  homeMessage = signal('Welcome to the Home Page!');
  lastKey: string = '';
  inputValue: string = '';

  keyUpHandler(event: KeyboardEvent) {
    this.inputValue = '';
    this.lastKey = event.key;
  }
}
