import { Component } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarService } from '../services/calendar.service';
import { DateClickArg } from '@fullcalendar/interaction';
import svLocale from '@fullcalendar/core/locales/sv';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../components/dialogs/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, MatDialogModule],
  templateUrl: './calendar.html',
  styleUrls: ['./calendar.css'],
})
export class CalendarComponent {
  calendarOptions: CalendarOptions;

  localEvents: EventInput[] = [];

  constructor(private dialog: MatDialog) {
    this.calendarOptions = {
      initialView: 'dayGridMonth',
      editable: true,
      weekends: true,
      plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
      locale: svLocale,
      eventTimeFormat: { hour: '2-digit', minute: '2-digit', hour12: false },
      slotLabelFormat: { hour: '2-digit', minute: '2-digit', hour12: false },
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay',
      },

      events: this.localEvents,
      dateClick: (arg) => this.handleDateClick(arg),
      eventClick: (arg) => this.handleEventClick(arg),
    };
  }

  handleDateClick(arg: DateClickArg) {
    const short = arg.date.toLocaleString('sv-SE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    const text = prompt(`Boka något för ${short}:`);
    if (text && text.trim() !== '') {
      const newEvent: EventInput = {
        id: String(this.localEvents.length + 1),
        title: text,
        date: arg.dateStr,
      };

      this.localEvents.push(newEvent);

      this.calendarOptions = {
        ...this.calendarOptions,
        events: [...this.localEvents],
      };
    }
  }

  // private refresh() {
  //   this.calendarOptions = { ...this.calendarOptions, events: [...this.localEvents] };
  // }

  // private formatDateTime(d: Date | null): string {
  //   return d
  //     ? `${d.toLocaleDateString('sv-SE')} ${d.toLocaleTimeString('sv-SE', {
  //         hour: '2-digit',
  //         minute: '2-digit',
  //         hour12: false,
  //       })}`
  //     : '';
  // }

  // handleDateClick(arg: DateClickArg) {
  //   const title = prompt(`Boka något för ${this.formatDateTime(arg.date)}:`);
  //   if (!title?.trim()) return;

  //   const start = new Date(arg.date);
  //   const end = new Date(start.getTime() + 60 * 60 * 1000); // default +1h

  //   this.localEvents.push({
  //     id: String(this.localEvents.length + 1),
  //     title,
  //     start,
  //     end,
  //     allDay: false,
  //   });
  //   this.refresh();
  // }
  handleEventClick(arg: any) {
    const start = arg.event.start;
    const dateStr = start ? start.toLocaleString('sv-SE') : '';
    if (confirm(`Vill du ta bort eventet "${arg.event.title}" den "${dateStr}"?`)) {
      arg.event.remove();
      this.localEvents = this.localEvents.filter((e) => e.id !== arg.event.id);
      this.calendarOptions = {
        ...this.calendarOptions,
        events: [...this.localEvents],
      };
    }
  }

  toggleWeekends() {
    this.calendarOptions.weekends = !this.calendarOptions.weekends;
  }
  changeView(view: string) {
    this.calendarOptions.initialView = view;
  }
}
