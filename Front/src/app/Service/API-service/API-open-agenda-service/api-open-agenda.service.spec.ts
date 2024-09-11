import { TestBed } from '@angular/core/testing';

import { ApiOpenAgendaService } from './api-open-agenda.service';

describe('ApiOpenAgendaService', () => {
  let service: ApiOpenAgendaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiOpenAgendaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
