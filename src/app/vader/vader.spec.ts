import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Vader } from './vader';

describe('Vader', () => {
  let component: Vader;
  let fixture: ComponentFixture<Vader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Vader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Vader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
