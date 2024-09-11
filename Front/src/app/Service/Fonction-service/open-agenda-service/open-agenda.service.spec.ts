import { TestBed } from '@angular/core/testing';

import { OpenAgendaService } from './open-agenda.service';

describe('OpenAgendaService', () => {
  let service: OpenAgendaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenAgendaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
