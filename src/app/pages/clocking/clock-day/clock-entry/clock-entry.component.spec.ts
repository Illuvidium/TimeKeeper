import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClockEntryComponent } from './clock-entry.component';

describe('ClockEntryComponent', () => {
  let component: ClockEntryComponent;
  let fixture: ComponentFixture<ClockEntryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClockEntryComponent]
    });
    fixture = TestBed.createComponent(ClockEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
