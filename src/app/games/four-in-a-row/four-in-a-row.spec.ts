import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FourInARowModel } from './four-in-a-row';

describe('FourInARow', () => {
  let component: FourInARowModel;
  let fixture: ComponentFixture<FourInARowModel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FourInARowModel],
    }).compileComponents();

    fixture = TestBed.createComponent(FourInARowModel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
