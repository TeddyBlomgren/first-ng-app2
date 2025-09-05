import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Spel } from './spel';

describe('Spel', () => {
  let component: Spel;
  let fixture: ComponentFixture<Spel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Spel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Spel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
