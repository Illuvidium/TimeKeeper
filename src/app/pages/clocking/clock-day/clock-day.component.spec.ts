import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClockDayComponent } from './clock-day.component';

describe('ClockDayComponent', () => {
  let component: ClockDayComponent;
  let fixture: ComponentFixture<ClockDayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClockDayComponent]
    });
    fixture = TestBed.createComponent(ClockDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
