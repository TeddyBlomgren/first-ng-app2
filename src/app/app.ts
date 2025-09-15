import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, CommonModule, FormsModule, HttpClientModule],
  standalone: true,
  template: `
    <app-header></app-header>
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [
    `
      main {
        padding: 16px;
      }
    `,
  ],
})
export class App {
  protected readonly title = signal('first-ng-app2');
  // Här anger vi plugins direkt i komponenten
  calendarPlugins = [dayGridPlugin, interactionPlugin];

  // Exempel-events
  calendarEvents = [
    { title: 'Möte', date: '2025-09-15' },
    { title: 'Födelsedag', date: '2025-09-20' },
  ];

  handleDateClick(arg: any) {
    alert('Du klickade på datum: ' + arg.dateStr);
  }
}
