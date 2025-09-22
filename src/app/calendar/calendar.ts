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
import { ErrorDialogComponent } from '../components/dialogs/error-dialog/error-dialog';

import { CalendarService } from '../services/calendar.service';
import { Event as CalendarEvent } from '../domain/Event/calenderClient';
import { firstValueFrom } from 'rxjs';
import { Subscription } from 'rxjs';

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
    eventStartEditable: true,
    eventDurationEditable: true,
    weekends: true,
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    events: (fetchInfo, successCallback, failureCallback) =>
      this.events(successCallback, failureCallback),
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

        const payload = new CalendarEvent();
        payload.title = title.trim();

        if (isMonthView) {
          const start = new Date(arg.date.getFullYear(), arg.date.getMonth(), arg.date.getDate());
          const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
          payload.start = start;
          payload.end = end;
          (payload as any).allday = true;
        } else {
          const start = new Date(arg.date);
          const end = new Date(start.getTime() + 60 * 60 * 1000);
          payload.start = start;
          payload.end = end;
          payload.allday = false;
        }

        this.calendarService.create(payload).subscribe({
          next: () => (arg.view.calendar as any).refetchEvents(),
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

        this.calendarService.delete(+arg.event.id).subscribe({
          next: () => (arg.view.calendar as any).refetchEvents(),
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

  async handleEventChange(info: any): Promise<void> {
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

    dto.start = e.start as any;
    dto.end = e.end as any;
    (dto as any).allday = e.allDay;

    this.calendarService.update(dto).subscribe({
      next: () => (info.view?.calendar as any)?.refetchEvents?.(),
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
}
