import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColourDropdownComponent } from './colour-dropdown.component';

describe('ColourDropdownComponent', () => {
  let component: ColourDropdownComponent;
  let fixture: ComponentFixture<ColourDropdownComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ColourDropdownComponent]
    });
    fixture = TestBed.createComponent(ColourDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
