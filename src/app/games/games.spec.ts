import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpelComponent } from './games';

describe('Spel', () => {
  let component: SpelComponent;
  let fixture: ComponentFixture<SpelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SpelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
