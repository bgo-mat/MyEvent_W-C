import { TestBed } from '@angular/core/testing';

import { OutlingService } from './outling.service';

describe('OutlingService', () => {
  let service: OutlingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OutlingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
