import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClockBarComponent } from './clock-bar.component';

describe('ClockBarComponent', () => {
  let component: ClockBarComponent;
  let fixture: ComponentFixture<ClockBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClockBarComponent]
    });
    fixture = TestBed.createComponent(ClockBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
