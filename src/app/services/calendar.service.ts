import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CalenderClient, Event as CalendarEvent } from '../domain/Event/calenderClient';

@Injectable({ providedIn: 'root' })
export class CalendarService {
  constructor(private api: CalenderClient) {}

  getAll(): Observable<CalendarEvent[]> {
    return this.api.eventsAll();
  }

  getById(id: number): Observable<CalendarEvent> {
    return this.api.eventsGET(id);
  }

  create(event: CalendarEvent): Observable<CalendarEvent> {
    return this.api.eventsPOST(event);
  }

  update(event: CalendarEvent): Observable<void> {
    if (!event.id) {
      throw new Error('inget id vid update');
    }
    return this.api.eventsPUT(event.id, event);
  }

  delete(id: number): Observable<void> {
    return this.api.eventsDELETE(id);
  }
}
