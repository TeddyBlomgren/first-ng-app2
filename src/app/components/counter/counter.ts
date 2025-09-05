import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-counter',
  imports: [],
  templateUrl: './counter.html',
  styleUrl: './counter.css'
})
export class Counter {
  counterValue = signal(0);
  Increment(){
    this.counterValue.update((val) => val + 1);
  }
  Decrement(){
    this.counterValue.update((val) => val - 1);
  }
  Reset(){
    this.counterValue.set(0);

  }
}
