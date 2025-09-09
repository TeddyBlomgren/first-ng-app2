import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FourInARow } from './four-in-a-row';

describe('FourInARow', () => {
  let component: FourInARow;
  let fixture: ComponentFixture<FourInARow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FourInARow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FourInARow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
