import { Component, input } from '@angular/core';

@Component({
  selector: 'app-greeting',
  imports: [],
  standalone: true,
  templateUrl: './greeting.html',
  styleUrls: ['./greeting.css'],
})
export class Greeting {
  message = input('Default Greeting message');
}
