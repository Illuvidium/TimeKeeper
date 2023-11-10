import { TestBed } from '@angular/core/testing';

import { ClockTimeService } from './clock-time.service';

describe('ClockTimeService', () => {
  let service: ClockTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClockTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
