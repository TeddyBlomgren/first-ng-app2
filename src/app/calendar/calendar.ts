import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';

import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { InputDialogComponent } from '../components/dialogs/input-dialog/input-dialog';
import { ConfirmDialogComponent } from '../components/dialogs/confirm-dialog/confirm-dialog';

import { CalendarService } from '../services/calendar.service';
import type { Event as ApiEvent } from '../domain/Event/calenderClient';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, DialogModule],
  templateUrl: './calendar.html',
  styleUrls: ['./calendar.css'],
})
export class CalendarComponent {
  calendarOptions: CalendarOptions;
  localEvents: EventInput[] = [];

  constructor(private dialog: Dialog) {
    this.calendarOptions = {
      initialView: 'dayGridMonth',
      editable: true,
      weekends: true,
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      locale: 'sv',
      timeZone: 'local',
      displayEventEnd: true,
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
    const isMonthView = arg.view.type === 'dayGridMonth' || arg.allDay === true;

    const when = isMonthView
      ? new Date(
          arg.date.getFullYear(),
          arg.date.getMonth(),
          arg.date.getDate()
        ).toLocaleDateString('sv-SE')
      : `${arg.date.toLocaleDateString('sv-SE')} ${arg.date.toLocaleTimeString('sv-SE', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })}`;

    this.dialog
      .open<string>(InputDialogComponent, {
        data: { title: 'Boka händelse', message: `Boka något för ${when}:`, placeholder: 'Titel' },
      })
      .closed.subscribe((title) => {
        if (!title) return;

        const newEvent: EventInput = isMonthView
          ? {
              id: String(this.localEvents.length + 1),
              title,
              start: arg.dateStr,
              allDay: true,
            }
          : {
              id: String(this.localEvents.length + 1),
              title,
              start: arg.date,
              end: new Date(arg.date.getTime() + 60 * 60 * 1000),
              allDay: false,
            };

        this.localEvents.push(newEvent);
        this.calendarOptions = { ...this.calendarOptions, events: [...this.localEvents] };
      });
  }

  handleEventClick(arg: EventClickArg) {
    const fmt = (d: Date | null) =>
      d
        ? `${d.toLocaleDateString('sv-SE')} ${d.toLocaleTimeString('sv-SE', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })}`
        : '';
    const when = arg.event.end
      ? `${fmt(arg.event.start)} – ${fmt(arg.event.end)}`
      : fmt(arg.event.start);

    this.dialog
      .open<boolean>(ConfirmDialogComponent, {
        data: {
          title: 'Ta bort händelse',
          message: `Vill du ta bort "${arg.event.title}" (${when})?`,
          confirmText: 'Ja',
          cancelText: 'Nej',
        },
      })
      .closed.subscribe((ok) => {
        if (!ok) return;
        arg.event.remove();
        this.localEvents = this.localEvents.filter((e) => e.id !== arg.event.id);
        this.calendarOptions = { ...this.calendarOptions, events: [...this.localEvents] };
      });
  }

  toggleWeekends() {
    this.calendarOptions.weekends = !this.calendarOptions.weekends;
  }
}
