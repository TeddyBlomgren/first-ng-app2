import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import listPlugin from '@fullcalendar/list';

import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { InputDialogComponent } from '../components/dialogs/input-dialog/input-dialog';
import { ConfirmDialogComponent } from '../components/dialogs/confirm-dialog/confirm-dialog';
import { ErrorDialogComponent } from '../components/dialogs/error-dialog/error-dialog';

import { CalendarService } from '../services/calendar.service';
import { Event as CalendarEvent } from '../domain/Event/calenderClient';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, DialogModule],
  templateUrl: './calendar.html',
  styleUrls: ['./calendar.css'],
})
export class CalendarComponent {
  private static readonly HOUR_IN_MS = 60 * 60 * 1000;
  private static readonly DAY_IN_MS = 24 * 60 * 60 * 1000;

  constructor(private dialog: Dialog, private calendarService: CalendarService) {}

  private formatDateOnly(date: Date): string {
    return date.toLocaleDateString('sv-SE');
  }

  calendarOptions: CalendarOptions = {
    themeSystem: 'bootstrap5',
    weekNumbers: true,
    weekNumberCalculation: 'ISO',
    weekNumberContent: (arg) => ({ html: `v. ${arg.num}` }),
    initialView: 'dayGridMonth',
    dayMaxEvents: true,
    editable: true,
    eventStartEditable: true,
    eventDurationEditable: true,
    weekends: true,
    firstDay: 1,
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, bootstrap5Plugin, listPlugin],
    events: (fetchInfo, successCallback, failureCallback) =>
      this.events(successCallback, failureCallback),
    locale: 'sv',
    timeZone: 'local',
    displayEventEnd: true,
    eventTimeFormat: { hour: '2-digit', minute: '2-digit', hour12: false },
    slotLabelFormat: { hour: '2-digit', minute: '2-digit', hour12: false },
    allDayText: 'Heldag',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
    },
    buttonText: {
      prev: '⇦',
      next: '⇨',
      today: 'Idag',
      month: 'Månad',
      week: 'Vecka',
      day: 'Dag',
      list: 'Lista',
    },

    dateClick: (arg) => this.handleDateClick(arg),
    eventClick: (arg) => this.handleEventClick(arg),
    eventChange: (info) => this.handleEventChange(info),
  };

  events(successCallback: (events: any[]) => void, failureCallback: (err?: any) => void) {
    this.calendarService.getAll().subscribe({
      next: (apiEvents) => {
        const events = apiEvents.map((e) => ({
          id: e.id,
          title: e.title ?? '',
          start: e.start,
          end: e.end,
          allDay: e.allday,
        }));
        successCallback(events);
      },
      error: (err) => {
        this.dialog.open(ErrorDialogComponent, {
          data: { title: 'Fel vid laddning', message: 'Kunde inte hämta bokningar.' },
        });
        failureCallback(err);
      },
    });
  }

  handleDateClick(arg: DateClickArg) {
    const isMonthView = arg.view.type === 'dayGridMonth' || arg.allDay === true;

    const when = isMonthView
      ? this.formatDateOnly(
          new Date(arg.date.getFullYear(), arg.date.getMonth(), arg.date.getDate())
        )
      : this.formatDateTime(arg.date);

    this.dialog
      .open<string>(InputDialogComponent, {
        data: { title: 'Boka händelse', message: `Boka något för ${when}:`, placeholder: 'Titel' },
      })
      .closed.subscribe((title) => {
        if (!title?.trim()) return;

        const payload = new CalendarEvent();
        payload.title = title.trim();

        if (isMonthView) {
          const start = new Date(arg.date.getFullYear(), arg.date.getMonth(), arg.date.getDate());
          const end = new Date(start.getTime() + CalendarComponent.DAY_IN_MS);
          payload.start = start;
          payload.end = end;
          payload.allday = true;
        } else {
          const start = new Date(arg.date);
          const end = new Date(start.getTime() + CalendarComponent.HOUR_IN_MS);
          payload.start = start;
          payload.end = end;
          payload.allday = false;
        }

        this.calendarService.create(payload).subscribe({
          next: () => this.refetchEvents(arg.view.calendar),
          error: () =>
            this.dialog.open(ErrorDialogComponent, {
              data: {
                title: 'Fel vid sparning',
                message: 'Kunde inte spara händelsen. Försök igen senare.',
              },
            }),
        });
      });
  }

  handleEventClick(arg: EventClickArg) {
    const when = arg.event.end
      ? `${this.formatDateTime(arg.event.start)} – ${this.formatDateTime(arg.event.end)}`
      : this.formatDateTime(arg.event.start);

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
        if (!ok || !arg.event.id) return;

        this.calendarService.delete(+arg.event.id).subscribe({
          next: () => this.refetchEvents(arg.view.calendar),
          error: () =>
            this.dialog.open(ErrorDialogComponent, {
              data: {
                title: 'Fel vid borttagning',
                message: 'Kunde inte ta bort händelsen. Försök igen senare.',
              },
            }),
        });
      });
  }

  handleEventChange(info: any): void {
    const e = info?.event;
    if (!e?.id) {
      this.dialog.open(ErrorDialogComponent, {
        data: { title: 'Fel', message: 'Ogiltig uppdatering.' },
      });
      info?.revert?.();
      return;
    }

    const dto = new CalendarEvent();
    dto.id = +e.id;
    dto.title = e.title;

    dto.start = e.start;
    dto.end = e.end;
    dto.allday = e.allDay;

    this.calendarService.update(dto).subscribe({
      next: () => this.refetchEvents(info.view?.calendar),
      error: () => {
        this.dialog.open(ErrorDialogComponent, {
          data: { title: 'Fel vid uppdatering', message: 'Kunde inte spara ändringen.' },
        });
        info?.revert?.();
      },
    });
  }

  toggleWeekends() {
    this.calendarOptions = {
      ...this.calendarOptions,
      weekends: !this.calendarOptions.weekends,
    };
  }
  private formatDateTime(date: Date | null): string {
    return date
      ? `${date.toLocaleDateString('sv-SE')} ${date.toLocaleTimeString('sv-SE', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })}`
      : '';
  }

  private refetchEvents(calendar: any): void {
    if (calendar?.refetchEvents) {
      calendar.refetchEvents();
    }
  }
}
