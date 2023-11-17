import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClockEntryEditComponent } from './clock-entry-edit.component';

describe('ClockEntryEditComponent', () => {
  let component: ClockEntryEditComponent;
  let fixture: ComponentFixture<ClockEntryEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClockEntryEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClockEntryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
