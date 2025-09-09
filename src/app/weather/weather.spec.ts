import { ComponentFixture, TestBed } from '@angular/core/testing';

import { weather } from './weather';

describe('Vader', () => {
  let component: weather;
  let fixture: ComponentFixture<weather>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [weather],
    }).compileComponents();

    fixture = TestBed.createComponent(weather);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
