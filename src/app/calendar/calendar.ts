// src/app/calendar/calendar.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';

import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { InputDialogComponent } from '../components/dialogs/input-dialog/input-dialog';
import { ConfirmDialogComponent } from '../components/dialogs/confirm-dialog/confirm-dialog';

import { CalendarService } from '../services/calendar.service';
import { Event as CalendarEvent } from '../domain/Event/calenderClient';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, DialogModule],
  templateUrl: './calendar.html',
  styleUrls: ['./calendar.css'],
})
export class CalendarComponent {
  constructor(private dialog: Dialog, private calendarService: CalendarService) {}

  calendarOptions: CalendarOptions = {
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

    // Hämta ALLTID direkt från API
    events: async () => {
      const apiEvents = await firstValueFrom(this.calendarService.getAll());
      return apiEvents.map((e) => ({
        id: e.id != null ? String(e.id) : undefined,
        title: e.title ?? '',
        start: e.start as any, // kan vara Date redan (NSwag fromJS), annars ISO-string funkar också i FullCalendar
        end: e.end as any,
        allDay: !!((e as any).allday ?? (e as any).allDay ?? (e as any).isAllDay),
      }));
    },

    dateClick: (arg) => this.handleDateClick(arg),
    eventClick: (arg) => this.handleEventClick(arg),
  };

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
      .closed.subscribe(async (title) => {
        if (!title?.trim()) return;

        // Viktigt: NSwag-klass -> skapa instans och använd Date-objekt
        const payload = new CalendarEvent();
        payload.title = title.trim();

        if (isMonthView) {
          // All-day: sätt start till midnatt och end till nästa dygn (vanligt mönster)
          const start = new Date(arg.date.getFullYear(), arg.date.getMonth(), arg.date.getDate());
          const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
          payload.start = start;
          payload.end = end;
          (payload as any).allday = true; // ändra till .allDay om din DTO faktiskt heter så
        } else {
          // Timme: start = klickad tid, end = +1h
          const start = new Date(arg.date);
          const end = new Date(start.getTime() + 60 * 60 * 1000);
          payload.start = start;
          payload.end = end;
          (payload as any).allday = false;
        }

        await firstValueFrom(this.calendarService.create(payload));
        (arg.view.calendar as any).refetchEvents();
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
      .closed.subscribe(async (ok) => {
        if (!ok || !arg.event.id) return;
        await firstValueFrom(this.calendarService.delete(+arg.event.id));
        (arg.view.calendar as any).refetchEvents();
      });
  }

  toggleWeekends() {
    this.calendarOptions.weekends = !this.calendarOptions.weekends;
  }
}
