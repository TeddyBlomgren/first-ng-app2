import { ComponentFixture, TestBed } from '@angular/core/testing';

import { weatherComponent } from './weather';

describe('Vader', () => {
  let component: weatherComponent;
  let fixture: ComponentFixture<weatherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [weatherComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(weatherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
