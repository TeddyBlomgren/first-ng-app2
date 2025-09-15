import { ComponentFixture, TestBed } from '@angular/core/testing';
import { calendarComponent } from './calendar';

describe('Calender', () => {
  let component: calendarComponent;
  let fixture: ComponentFixture<calendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [calendarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(calendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
