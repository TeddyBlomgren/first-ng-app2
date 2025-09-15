import { Component } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid/index.js';
import interactionPlugin from '@fullcalendar/interaction/index.js';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-calendar',
  imports: [CommonModule, RouterOutlet, FullCalendarModule],
  standalone: true,
  templateUrl: './calendar.html',
  styleUrl: './calendar.css',
})
export class calendarComponent {
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
  };
}
