import { TestBed } from '@angular/core/testing';

import { ElectronStorageService } from './electron-storage.service';

describe('ElectronStorageService', () => {
  let service: ElectronStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElectronStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
