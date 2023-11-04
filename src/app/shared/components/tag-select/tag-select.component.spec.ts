import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagSelectComponent } from './tag-select.component';

describe('TagSelectComponent', () => {
  let component: TagSelectComponent;
  let fixture: ComponentFixture<TagSelectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TagSelectComponent]
    });
    fixture = TestBed.createComponent(TagSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
